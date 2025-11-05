using ECommerce_Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Attributes.Queries
{
    public sealed class ListAttributesQueryHandler(IApplicationDbContext db)
    : IRequestHandler<ListAttributesQuery, (IEnumerable<AttributeDto> Items, long Total)>
    {
        public async Task<(IEnumerable<AttributeDto> Items, long Total)> Handle(ListAttributesQuery q, CancellationToken ct)
        {
            var src = db.AttributeDefinitions.Where(a => !a.IsDeleted);

            if (!string.IsNullOrWhiteSpace(q.Keyword))
                src = src.Where(a => a.Name.Contains(q.Keyword) || a.Slug.Contains(q.Keyword));

            var total = await src.LongCountAsync(ct);

            var items = await src
                .OrderByDescending(a => a.CreatedAt)
                .Skip((q.Page - 1) * q.Size)
                .Take(q.Size)
                .Select(a => new AttributeDto(a.AttributeId, a.Name, a.Slug, (byte)a.DataType, a.Unit, a.IsFilterable, a.IsVariant, a.CreatedAt))
                .ToListAsync(ct);

            return (items, total);
        }
    }
}
