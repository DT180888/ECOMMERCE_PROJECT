using ECommerce_Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Categories.Queries
{
    public sealed record GetCategoryByIdQuery(int CategoryId) : IRequest<CategoryDto?>;

    public sealed class GetCategoryByIdQueryHandler(IApplicationDbContext db)
      : IRequestHandler<GetCategoryByIdQuery, CategoryDto?>
    {
        public async Task<CategoryDto?> Handle(GetCategoryByIdQuery q, CancellationToken ct)
        {
            return await db.Categories
                .Where(c => c.CategoryId == q.CategoryId && !c.IsDeleted)
                .Select(c => new CategoryDto(c.CategoryId, c.Name, c.Slug, c.ParentId, c.CreatedAt))
                .FirstOrDefaultAsync(ct);
        }
    }
}
