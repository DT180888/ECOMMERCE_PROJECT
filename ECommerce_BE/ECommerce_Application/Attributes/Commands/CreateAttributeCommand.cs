using ECommerce_Application.Common.Interfaces;
using ECommerce_Domain.Entites;
using ECommerce_Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Attributes.Commands
{
    public sealed record CreateAttributeCommand(
         string Name,
         string Slug,
         byte DataType,
         string? Unit,
         bool IsFilterable,
         bool IsVariant
     ) : IRequest<int>;

    public sealed class CreateAttributeCommandHandler(IApplicationDbContext db)
        : IRequestHandler<CreateAttributeCommand, int>
    {
        public async Task<int> Handle(CreateAttributeCommand c, CancellationToken ct)
        {
            var dup = await db.AttributeDefinitions.AnyAsync(x => x.Name == c.Name || x.Slug == c.Slug, ct);
            if (dup) throw new InvalidOperationException("Attribute name/slug already exists.");

            var now = DateTime.UtcNow;

            var e = new AttributeDefinition
            {
                Name = c.Name.Trim(),
                Slug = c.Slug.Trim(),
                DataType = (AttributeDataType)c.DataType,
                Unit = string.IsNullOrWhiteSpace(c.Unit) ? null : c.Unit.Trim(),
                IsFilterable = c.IsFilterable,
                IsVariant = c.IsVariant,
                IsDeleted = false,
                CreatedAt = now
            };

            db.AttributeDefinitions.Add(e);
            await db.SaveChangesAsync(ct);
            return e.AttributeId;
        }
    }
}
