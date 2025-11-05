using ECommerce_Application.Common.Interfaces;
using ECommerce_Domain.Entites;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Products.Queries
{
    public sealed class ListProductsQueryHandler(IApplicationDbContext db)
  : IRequestHandler<ListProductsQuery, (IEnumerable<ProductCardDto> Items, long Total)>
    {
        public async Task<(IEnumerable<ProductCardDto>, long)> Handle(ListProductsQuery q, CancellationToken ct)
        {
            // base source
            var src = db.Products.AsQueryable();

            // filters
            if (!string.IsNullOrWhiteSpace(q.Keyword))
                src = src.Where(p => p.Name.Contains(q.Keyword) || p.Slug.Contains(q.Keyword));
            if (q.BrandId is not null)
                src = src.Where(p => p.BrandId == q.BrandId);
            if (q.Status is not null)
                src = src.Where(p => p.Status == q.Status);
            if (q.CategoryId is not null)
                src = src.Where(p => db.ProductCategories.Any(pc => pc.ProductId == p.ProductID && pc.CategoryId == q.CategoryId));

            // price range via min SKU price
            if (q.PriceMin is not null)
                src = src.Where(p => db.ProductSkus.Where(s => s.ProductId == p.ProductID && s.IsActive)
                                     .Select(s => (long?)s.PriceMinor).Min() >= q.PriceMin);
            if (q.PriceMax is not null)
                src = src.Where(p => db.ProductSkus.Where(s => s.ProductId == p.ProductID && s.IsActive)
                                     .Select(s => (long?)s.PriceMinor).Min() <= q.PriceMax);

            var total = await src.LongCountAsync(ct);

            // ordering
            IOrderedQueryable<Product>? ordered = null; // <-- Đã thay đổi từ dynamic sang Product
            switch (q.Sort)
            {
                case "price_asc":
                    ordered = src.OrderBy(p => db.ProductSkus.Where(s => s.ProductId == p.ProductID && s.IsActive)
                                  .Select(s => (long?)s.PriceMinor).Min());
                    break;
                case "price_desc":
                    ordered = src.OrderByDescending(p => db.ProductSkus.Where(s => s.ProductId == p.ProductID && s.IsActive)
                                  .Select(s => (long?)s.PriceMinor).Min());
                    break;
                case "name_asc": ordered = src.OrderBy(p => p.Name); break;
                case "name_desc": ordered = src.OrderByDescending(p => p.Name); break;
                case "created_asc": ordered = src.OrderBy(p => p.CreatedAt); break;
                default: ordered = src.OrderByDescending(p => p.CreatedAt); break;
            }

            var pageItems = await ordered!
              .Skip((q.Page - 1) * q.Size)
              .Take(q.Size)
              .Select(p => new ProductCardDto(
                  p.ProductID, // Sử dụng ProductID thay vì ProductId nếu là tên thuộc tính thực sự
                  p.Name,
                  p.Slug,
                  db.ProductImages.Where(i => i.ProductId == p.ProductID && i.IsPrimary) // ProductID
                                  .Select(i => i.Url).FirstOrDefault(),
                  db.ProductSkus.Where(s => s.ProductId == p.ProductID && s.IsActive) // ProductID
                                .Select(s => (long?)s.PriceMinor).Min(),
                  p.BrandId
              ))
              .ToListAsync(ct);

            return (pageItems, total);
        }
    }
}
