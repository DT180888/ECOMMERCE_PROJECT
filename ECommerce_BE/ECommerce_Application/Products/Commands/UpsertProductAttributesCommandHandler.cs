using ECommerce_Application.Common.Interfaces;
using ECommerce_Domain.Entites;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Products.Commands
{
    public sealed class UpsertProductAttributesCommandHandler(IApplicationDbContext db)
    : IRequestHandler<UpsertProductAttributesCommand>
    {
        public async Task Handle(UpsertProductAttributesCommand c, CancellationToken ct)
        {
            // Kiểm tra product
            var productExists = await db.Products.AnyAsync(p => p.ProductID == c.ProductId && !p.IsDeleted, ct);
            if (!productExists) throw new KeyNotFoundException("Product not found.");

            var attrs = c.Attributes ?? new();

            // Validate AttributeId tồn tại
            if (attrs.Count > 0)
            {
                var ids = attrs.Select(a => a.AttributeId).Distinct().ToList();
                var existIds = await db.AttributeDefinitions
                                       .Where(a => ids.Contains(a.AttributeId))
                                       .Select(a => a.AttributeId)
                                       .ToListAsync(ct);
                if (existIds.Count != ids.Count)
                    throw new InvalidOperationException("Some attributes not found.");

                // (Tuỳ chọn) Validate kiểu dữ liệu theo AttributeDefinition.DataType
                // Có thể load DataType và kiểm tra ValueText/ValueNumber/ValueBool tương ứng
            }

            // Replace toàn bộ attribute values của product (policy đơn giản)
            await db.ProductAttributeValues
                    .Where(x => x.ProductId == c.ProductId)
                    .ExecuteDeleteAsync(ct);

            foreach (var a in attrs)
            {
                db.ProductAttributeValues.Add(new ProductAttributeValue
                {
                    ProductId = c.ProductId,
                    AttributeId = a.AttributeId,
                    ValueText = a.ValueText,
                    ValueNumber = a.ValueNumber,
                    ValueBool = a.ValueBool
                });
            }

            await db.SaveChangesAsync(ct);
        }
    }
}
