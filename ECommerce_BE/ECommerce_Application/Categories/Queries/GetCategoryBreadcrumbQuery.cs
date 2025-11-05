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
    public sealed record GetCategoryBreadcrumbQuery(int CategoryId) : IRequest<IReadOnlyList<BreadcrumbItemDto>>;

    public sealed record BreadcrumbItemDto(int CategoryId, string Name, string Slug);

    public sealed class GetCategoryBreadcrumbQueryHandler(IApplicationDbContext db)
      : IRequestHandler<GetCategoryBreadcrumbQuery, IReadOnlyList<BreadcrumbItemDto>>
    {
        public async Task<IReadOnlyList<BreadcrumbItemDto>> Handle(GetCategoryBreadcrumbQuery q, CancellationToken ct)
        {
            // Load tất cả IDs cha ngược lên (simple loop)
            var map = await db.Categories
                .Where(c => !c.IsDeleted)
                .Select(c => new { c.CategoryId, c.ParentId, c.Name, c.Slug })
                .ToDictionaryAsync(x => x.CategoryId, x => (x.ParentId, x.Name, x.Slug), ct);

            var list = new List<BreadcrumbItemDto>();
            int? current = q.CategoryId;
            while (current is not null && map.TryGetValue(current.Value, out var node))
            {
                list.Add(new BreadcrumbItemDto(current.Value, node.Name, node.Slug));
                current = node.ParentId;
            }
            list.Reverse();
            return list;
        }
    }
}
