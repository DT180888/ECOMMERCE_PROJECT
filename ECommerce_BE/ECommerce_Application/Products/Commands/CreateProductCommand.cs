using ECommerce_Application.Common.Interfaces;
using ECommerce_Domain.Entites;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ECommerce_Application.Products.Commands;

public sealed record CreateProductCommand(
    string Name, string Slug, string? Description, byte Status, int? BrandId,
    List<ProductSkuCreate> Skus,
    List<ProductImageUpsert> Images,
    List<int> CategoryIds,
    List<ProductAttributeUpsert> Attributes
) : IRequest<long>;

public sealed class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, long>
{
    private readonly IApplicationDbContext _db;
    private readonly IImageStorage _storage;

    public CreateProductCommandHandler(IApplicationDbContext db, IImageStorage storage)
    {
        _db = db;
        _storage = storage;
    }

    public async Task<long> Handle(CreateProductCommand c, CancellationToken ct)
    {
        // 1) Validate slug
        var slugExists = await _db.Products.AnyAsync(x => x.Slug == c.Slug && !x.IsDeleted, ct);
        if (slugExists) throw new InvalidOperationException("Product slug already exists.");

        // 2) Validate brand
        if (c.BrandId is not null)
        {
            var brandOk = await _db.Brands.AnyAsync(b => b.BrandId == c.BrandId && !b.IsDeleted, ct);
            if (!brandOk) throw new InvalidOperationException("Brand not found.");
        }

        // 3) Validate categories
        if (c.CategoryIds.Count > 0)
        {
            var valid = await _db.Categories
                .Where(cat => !cat.IsDeleted && c.CategoryIds.Contains(cat.CategoryId))
                .Select(cat => cat.CategoryId)
                .ToListAsync(ct);

            if (valid.Count != c.CategoryIds.Count)
                throw new InvalidOperationException("Some categories not found.");
        }

        // 4) Validate attributes
        if (c.Attributes.Count > 0)
        {
            var ids = c.Attributes.Select(a => a.AttributeId).Distinct().ToList();
            var ok = await _db.AttributeDefinitions
                              .Where(a => ids.Contains(a.AttributeId) && !a.IsDeleted)
                              .Select(a => a.AttributeId)
                              .ToListAsync(ct);
            if (ok.Count != ids.Count)
                throw new InvalidOperationException("Some attributes not found.");
        }

        // 5) Enforce single primary image
        if (c.Images.Count(i => i.IsPrimary) > 1)
            throw new InvalidOperationException("Only one primary image is allowed.");

        var now = DateTime.UtcNow;

        var p = new Product
        {
            Name = c.Name.Trim(),
            Slug = c.Slug.Trim(),
            Description = c.Description,
            Status = c.Status,
            BrandId = c.BrandId,
            CreatedAt = now,
            IsDeleted = false
        };

        _db.Products.Add(p);
        await _db.SaveChangesAsync(ct); // có ProductID

        // Chuẩn hoá ảnh: đặt ảnh đầu làm primary nếu chưa có
        var imgs = c.Images
            .Select((i, idx) => new ProductImageUpsert(
                i.Url,
                i.IsPrimary || idx == 0,
                i.SortOrder > 0 ? i.SortOrder : idx + 1
            ))
            .OrderBy(x => x.SortOrder)
            .ToList();

        // 6) SKUs
        foreach (var s in c.Skus)
        {
            _db.ProductSkus.Add(new ProductSku
            {
                ProductId = p.ProductID,
                SkuCode = s.SkuCode,
                PriceMinor = s.PriceMinor,
                IsActive = s.IsActive
            });
        }

        // 7) Images: move ảnh từ tmp → products/{productId} nếu cần
        foreach (var i in imgs)
        {
            var path = ExtractRelativePath(i.Url); // "/uploads/..." -> "..."
            ImageStoredResult res;

            if (path.StartsWith("tmp/", StringComparison.OrdinalIgnoreCase))
            {
                res = await _storage.MoveAsync(path, $"products/{p.ProductID}", ct);
            }
            else
            {
                // ảnh đã nằm đúng thư mục public uploads
                res = new ImageStoredResult(i.Url, path, "", 0);
            }

            _db.ProductImages.Add(new ProductImage
            {
                ProductId = p.ProductID,
                Url = res.Url,
                IsPrimary = i.IsPrimary,
                SortOrder = i.SortOrder,
                CreatedAt = now
            });
        }

        // 8) Categories
        foreach (var catId in c.CategoryIds)
        {
            _db.ProductCategories.Add(new ProductCategory
            {
                ProductId = p.ProductID,
                CategoryId = catId
            });
        }

        // 9) Attributes
        foreach (var a in c.Attributes)
        {
            _db.ProductAttributeValues.Add(new ProductAttributeValue
            {
                ProductId = p.ProductID,
                AttributeId = a.AttributeId,
                ValueText = a.ValueText,
                ValueNumber = a.ValueNumber,
                ValueBool = a.ValueBool
            });
        }

        await _db.SaveChangesAsync(ct);
        return p.ProductID;
    }

    // NOTE: Application không nên biết config BaseUrl. Ở đây dùng quy ước /uploads/.
    // Nếu muốn baseUrl động, ta đưa helper này vào abstraction ở Infrastructure rồi gọi qua IImageStorage.
    private static string ExtractRelativePath(string url)
    {
        // Chuẩn hoá: chấp nhận "/uploads/..." hoặc "https://host/uploads/..."
        const string marker = "/uploads/";
        var idx = url.IndexOf(marker, StringComparison.OrdinalIgnoreCase);
        if (idx < 0)
            throw new InvalidOperationException("Image url must be an internal uploads url.");

        return url[(idx + marker.Length)..].TrimStart('/');
    }
}
