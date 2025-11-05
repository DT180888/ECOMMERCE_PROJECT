using ECommerce_Application.Common.Interfaces;
using ECommerce_Domain.Entites;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce_Application.Products.Commands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Products.Commands
{
    public sealed record UpdateProductCommand(
        long ProductId,
        string Name, string Slug, string? Description, byte Status, int? BrandId,
        List<ProductSkuUpdate> Skus,
        List<ProductImageUpsert> Images,
        List<int> CategoryIds,
        List<ProductAttributeUpsert> Attributes
    ) : IRequest;

    public sealed class UpdateProductCommandHandler(IApplicationDbContext db) : IRequestHandler<UpdateProductCommand>
    {
        public async Task Handle(UpdateProductCommand c, CancellationToken ct)
        {
            var p = await db.Products.FirstOrDefaultAsync(x => x.ProductID == c.ProductId && !x.IsDeleted, ct);
            if (p is null) throw new KeyNotFoundException("Product not found.");

            // slug unique
            var dupSlug = await db.Products.AnyAsync(x => x.ProductID != c.ProductId && x.Slug == c.Slug, ct);
            if (dupSlug) throw new InvalidOperationException("Product slug already exists.");

            // brand
            if (c.BrandId is not null)
            {
                var brandOk = await db.Brands.AnyAsync(b => b.BrandId == c.BrandId && !b.IsDeleted, ct);
                if (!brandOk) throw new InvalidOperationException("Brand not found.");
            }

            // images: tối đa 1 primary
            if (c.Images.Count(i => i.IsPrimary) > 1)
                throw new InvalidOperationException("Only one primary image is allowed.");

            // Update core
            p.Name = c.Name.Trim();
            p.Slug = c.Slug.Trim();
            p.Description = c.Description;
            p.Status = c.Status;
            p.BrandId = c.BrandId;

            // Replace images
            await db.ProductImages.Where(i => i.ProductId == p.ProductID).ExecuteDeleteAsync(ct);
            foreach (var img in c.Images ?? [])
            {
                db.ProductImages.Add(new ProductImage
                {
                    ProductId = p.ProductID,
                    Url = img.Url,
                    IsPrimary = img.IsPrimary,
                    SortOrder = img.SortOrder
                });
            }

            // Replace categories
            await db.ProductCategories.Where(pc => pc.ProductId == p.ProductID).ExecuteDeleteAsync(ct);
            foreach (var catId in (c.CategoryIds ?? []))
            {
                db.ProductCategories.Add(new ProductCategory { ProductId = p.ProductID, CategoryId = catId });
            }

            // Replace attributes
            await db.ProductAttributeValues.Where(a => a.ProductId == p.ProductID).ExecuteDeleteAsync(ct);
            foreach (var a in c.Attributes ?? [])
            {
                db.ProductAttributeValues.Add(new ProductAttributeValue
                {
                    ProductId = p.ProductID,
                    AttributeId = a.AttributeId,
                    ValueText = a.ValueText,
                    ValueNumber = a.ValueNumber,
                    ValueBool = a.ValueBool
                });
            }

            // Upsert SKUs (đơn giản: nếu có Id thì update; không có thì insert; không có trong danh sách thì delete)
            var existingSkus = await db.ProductSkus.Where(s => s.ProductId == p.ProductID).ToListAsync(ct);
            var idsInReq = c.Skus.Where(s => s.SkuId is not null).Select(s => s.SkuId!.Value).ToHashSet();

            // delete removed
            var toDelete = existingSkus.Where(s => !idsInReq.Contains(s.Id)).ToList();
            if (toDelete.Count > 0)
            {
                db.ProductSkus.RemoveRange(toDelete);
            }

            // upsert others
            foreach (var s in c.Skus)
            {
                if (s.SkuId is null)
                {
                    db.ProductSkus.Add(new ProductSku
                    {
                        ProductId = p.ProductID,
                        SkuCode = s.SkuCode,
                        PriceMinor = s.PriceMinor,
                        IsActive = s.IsActive
                    });
                }
                else
                {
                    var sku = existingSkus.First(x => x.Id == s.SkuId);
                    sku.SkuCode = s.SkuCode;
                    sku.PriceMinor = s.PriceMinor;
                    sku.IsActive = s.IsActive;
                }
            }

            await db.SaveChangesAsync(ct);
        }
    }
}
