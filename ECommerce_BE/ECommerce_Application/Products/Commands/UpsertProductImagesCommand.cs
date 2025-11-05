using ECommerce_Application.Common.Interfaces;
using ECommerce_Domain.Entites;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ECommerce_Application.Products.Commands
{
    public sealed class UpsertProductImagesCommandHandler : IRequestHandler<UpsertProductImagesCommand>
    {
        private readonly IApplicationDbContext _db;
        private readonly IImageStorage _storage;

        public UpsertProductImagesCommandHandler(IApplicationDbContext db, IImageStorage storage)
        {
            _db = db;
            _storage = storage;
        }

        public async Task Handle(UpsertProductImagesCommand c, CancellationToken ct)
        {
            // 1) Kiểm tra product tồn tại & chưa xóa mềm
            var exists = await _db.Products
                                  .AsNoTracking()
                                  .AnyAsync(p => p.ProductID == c.ProductId && !p.IsDeleted, ct);
            if (!exists) throw new InvalidOperationException("Product not found.");

            if (c.Images is null || c.Images.Count == 0)
                throw new InvalidOperationException("Images cannot be empty.");

            // 2) Chuẩn hoá: 1 ảnh primary
            //    - Nếu nhiều ảnh IsPrimary=true -> giữ ảnh có SortOrder nhỏ nhất
            //    - Nếu không có ảnh nào -> đặt ảnh đầu tiên làm primary
            var ordered = c.Images
                           .OrderBy(i => i.SortOrder > 0 ? i.SortOrder : int.MaxValue)
                           .ThenBy(i => i.Url) // tie-break
                           .ToList();

            if (ordered.Count(i => i.IsPrimary) == 0)
                ordered[0] = ordered[0] with { IsPrimary = true };
            else if (ordered.Count(i => i.IsPrimary) > 1)
            {
                var primaryKept = false;
                for (int k = 0; k < ordered.Count; k++)
                {
                    if (ordered[k].IsPrimary)
                    {
                        if (!primaryKept) { primaryKept = true; }
                        else ordered[k] = ordered[k] with { IsPrimary = false };
                    }
                }
            }

            // 3) Soft-delete tất cả ảnh cũ (nếu entity ProductImage có IsDeleted + query filter)
            var oldImgs = await _db.ProductImages
                                   .Where(pi => pi.ProductId == c.ProductId && !pi.IsDeleted)
                                   .ToListAsync(ct);

            foreach (var oi in oldImgs)
                oi.IsDeleted = true;

            // 4) Thêm ảnh mới (move từ tmp nếu cần)
            var now = DateTime.UtcNow;

            foreach (var i in ordered.Select((img, idx) =>
                     new ProductImageUpsert(img.Url, img.IsPrimary, img.SortOrder > 0 ? img.SortOrder : idx + 1)))
            {
                var path = ExtractRelativePath(i.Url); // "/uploads/..." => "..."
                ImageStoredResult res;

                if (path.StartsWith("tmp/", StringComparison.OrdinalIgnoreCase))
                    res = await _storage.MoveAsync(path, $"products/{c.ProductId}", ct);
                else
                    res = new ImageStoredResult(i.Url, path, "", 0);

                _db.ProductImages.Add(new ProductImage
                {
                    ProductId = c.ProductId,
                    Url = res.Url,
                    IsPrimary = i.IsPrimary,
                    SortOrder = i.SortOrder,
                    CreatedAt = now,
                    IsDeleted = false
                });
            }

            await _db.SaveChangesAsync(ct);
        }

        private static string ExtractRelativePath(string url)
        {
            const string marker = "/uploads/";
            var idx = url.IndexOf(marker, StringComparison.OrdinalIgnoreCase);
            if (idx < 0) throw new InvalidOperationException("Image url must be an internal uploads url.");
            return url[(idx + marker.Length)..].TrimStart('/');
        }
    }
}



