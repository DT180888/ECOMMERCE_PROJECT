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
    public sealed class ListBrandsQueryHandler(IApplicationDbContext db)
    : IRequestHandler<ListBrandsQuery, (IEnumerable<BrandDto> Items, long Total)>
    {
        public async Task<(IEnumerable<BrandDto> Items, long Total)> Handle(ListBrandsQuery q, CancellationToken ct)
        {
            var src = db.Brands.Where(b => !b.IsDeleted);

            if (!string.IsNullOrWhiteSpace(q.Keyword))
                src = src.Where(b => b.Name.Contains(q.Keyword));

            var total = await src.LongCountAsync(ct);

            var items = await src
                .OrderByDescending(b => b.CreatedAt)
                .Skip((q.Page - 1) * q.Size)
                .Take(q.Size)
                .Select(b => new BrandDto(b.BrandId, b.Name, b.Slug, b.CreatedAt))
                .ToListAsync(ct);

            return (items, total);
        }
    }
}
