using ECommerce_Application.Common.Interfaces;
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
    public sealed record UpdateAttributeCommand(
         int AttributeId,
         string Name,
         string Slug,
         byte DataType,
         string? Unit,
         bool IsFilterable,
         bool IsVariant
     ) : IRequest;

    public sealed class UpdateAttributeCommandHandler(IApplicationDbContext db)
        : IRequestHandler<UpdateAttributeCommand>
    {
        public async Task Handle(UpdateAttributeCommand c, CancellationToken ct)
        {
            var e = await db.AttributeDefinitions.FirstOrDefaultAsync(x => x.AttributeId == c.AttributeId && !x.IsDeleted, ct);
            if (e is null) throw new KeyNotFoundException("Attribute not found.");

            var dup = await db.AttributeDefinitions.AnyAsync(x =>
                x.AttributeId != c.AttributeId && (x.Name == c.Name || x.Slug == c.Slug), ct);
            if (dup) throw new InvalidOperationException("Attribute name/slug already exists.");

            e.Name = c.Name.Trim();
            e.Slug = c.Slug.Trim();
            e.DataType = (AttributeDataType)c.DataType;
            e.Unit = string.IsNullOrWhiteSpace(c.Unit) ? null : c.Unit.Trim();
            e.IsFilterable = c.IsFilterable;
            e.IsVariant = c.IsVariant;

            await db.SaveChangesAsync(ct);
        }
    }
}
