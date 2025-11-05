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
    public sealed record GetAttributeByIdQuery(int AttributeId) : IRequest<AttributeDto?>;

    public sealed class GetAttributeByIdQueryHandler(IApplicationDbContext db)
        : IRequestHandler<GetAttributeByIdQuery, AttributeDto?>
    {
        public async Task<AttributeDto?> Handle(GetAttributeByIdQuery q, CancellationToken ct)
        {
            return await db.AttributeDefinitions
                .Where(a => a.AttributeId == q.AttributeId && !a.IsDeleted)
                .Select(a => new AttributeDto(a.AttributeId, a.Name, a.Slug, (byte)a.DataType, a.Unit, a.IsFilterable, a.IsVariant, a.CreatedAt))
                .FirstOrDefaultAsync(ct);
        }
    }
}
