using ECommerce_Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Products.Queries
{
    public sealed record GetProductDetailQuery(long ProductId) : IRequest<ProductDetailDto?>;

    public sealed record ProductDetailDto(
        long ProductId, string Name, string Slug, string? Description, byte Status, int? BrandId,
        IEnumerable<SkuItem> Skus, IEnumerable<ImageItem> Images, IEnumerable<int> CategoryIds, IEnumerable<AttrItem> Attributes);

    public sealed record SkuItem(long SkuId, string SkuCode, long PriceMinor, bool IsActive);
    public sealed record ImageItem(long ImageId, string Url, bool IsPrimary, int SortOrder);
    public sealed record AttrItem(int AttributeId, string? ValueText, decimal? ValueNumber, bool? ValueBool);

    public sealed class GetProductDetailQueryHandler(IApplicationDbContext db)
      : IRequestHandler<GetProductDetailQuery, ProductDetailDto?>
    {
        public async Task<ProductDetailDto?> Handle(GetProductDetailQuery q, CancellationToken ct)
        {
            var p = await db.Products
                 .AsNoTracking()
                 .Where(p => p.ProductID == q.ProductId && !p.IsDeleted)
                 .Select(p => new ProductDetailDto(
                     p.ProductID,
                     p.Name,
                     p.Slug,
                     p.Description,
                     p.Status,
                     p.BrandId,

                     // SKUs
                     p.ProductSkus
                         .OrderByDescending(s => s.IsActive)
                         .ThenBy(s => s.PriceMinor)
                         .Select(s => new SkuItem(s.Id, s.SkuCode, s.PriceMinor, s.IsActive))
                         .ToList(),

                     // Images
                     p.ProductImages
                         .OrderByDescending(i => i.IsPrimary)
                         .ThenBy(i => i.SortOrder)
                         .Select(i => new ImageItem(i.ImageId, i.Url, i.IsPrimary, i.SortOrder))
                         .ToList(),

                     // CategoryIds
                     p.ProductCategories
                         .Select(pc => pc.CategoryId)
                         .ToList(),

                     // Attributes
                     p.ProductAttributeValues
                         .Select(a => new AttrItem(a.AttributeId, a.ValueText, a.ValueNumber, a.ValueBool))
                         .ToList()
                 ))
                 .FirstOrDefaultAsync(ct);

            return p;
        }
    }
}
