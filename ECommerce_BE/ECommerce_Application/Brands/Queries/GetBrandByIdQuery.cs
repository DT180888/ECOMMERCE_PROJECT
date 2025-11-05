using ECommerce_Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Brands.Queries
{
    public sealed record GetBrandByIdQuery(int BrandId) : IRequest<BrandDto?>;

    public sealed class GetBrandByIdQueryHandler(IApplicationDbContext db)
        : IRequestHandler<GetBrandByIdQuery, BrandDto?>
    {
        public async Task<BrandDto?> Handle(GetBrandByIdQuery q, CancellationToken ct)
        {
            return await db.Brands
                .Where(b => b.BrandId == q.BrandId && !b.IsDeleted)
                .Select(b => new BrandDto(b.BrandId, b.Name, b.Slug, b.CreatedAt))
                .FirstOrDefaultAsync(ct);
        }
    }
}
