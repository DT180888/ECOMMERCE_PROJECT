using ECommerce_Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Categories.Queries
{
    public sealed record GetCategoryTreeQuery : IRequest<IReadOnlyList<CategoryNodeDto>>;

    public sealed record CategoryNodeDto(int CategoryId, string Name, string Slug, int? ParentId, List<CategoryNodeDto> Children);

    public sealed class GetCategoryTreeQueryHandler(IApplicationDbContext db)
      : IRequestHandler<GetCategoryTreeQuery, IReadOnlyList<CategoryNodeDto>>
    {
        public async Task<IReadOnlyList<CategoryNodeDto>> Handle(GetCategoryTreeQuery q, CancellationToken ct)
        {
            var all = await db.Categories
                .Where(c => !c.IsDeleted)
                .Select(c => new { c.CategoryId, c.Name, c.Slug, c.ParentId })
                .ToListAsync(ct);

            var lookup = all.ToDictionary(
                x => x.CategoryId,
                x => new CategoryNodeDto(x.CategoryId, x.Name, x.Slug, x.ParentId, new())
            );

            // build tree
            List<CategoryNodeDto> roots = new();
            foreach (var item in lookup.Values)
            {
                if (item.ParentId is null || !lookup.TryGetValue(item.ParentId.Value, out var parent))
                    roots.Add(item);
                else
                    parent.Children.Add(item);
            }

            return roots;
        }
    }
}
