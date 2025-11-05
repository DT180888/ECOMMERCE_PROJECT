using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce_Application.Common.Interfaces;

namespace ECommerce_Application.Categories.Queries
{
    public sealed class ListCategoriesQueryHandler(IApplicationDbContext db)
      : IRequestHandler<ListCategoriesQuery, (IEnumerable<CategoryDto>, long)>
    {
        public async Task<(IEnumerable<CategoryDto>, long)> Handle(ListCategoriesQuery q, CancellationToken ct)
        {
            var src = db.Categories.Where(c => !c.IsDeleted);

            if (!string.IsNullOrWhiteSpace(q.Keyword))
                src = src.Where(c => c.Name.Contains(q.Keyword));

            var total = await src.LongCountAsync(ct);

            var items = await src
                .OrderByDescending(c => c.CreatedAt)
                .Skip((q.Page - 1) * q.Size)
                .Take(q.Size)
                .Select(c => new CategoryDto(c.CategoryId, c.Name, c.Slug, c.ParentId, c.CreatedAt))
                .ToListAsync(ct);

            return (items, total);
        }
    }
}
