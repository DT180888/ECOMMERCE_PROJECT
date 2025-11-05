using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce_Application.Common.Interfaces;

namespace ECommerce_Application.Categories.Commands
{
    public sealed record MoveCategoryCommand(int CategoryId, int? NewParentId) : IRequest;

    public sealed class MoveCategoryCommandHandler(IApplicationDbContext db)
      : IRequestHandler<MoveCategoryCommand>
    {
        public async Task Handle(MoveCategoryCommand c, CancellationToken ct)
        {
            var cat = await db.Categories.FirstOrDefaultAsync(x => x.CategoryId == c.CategoryId && !x.IsDeleted, ct);
            if (cat is null) throw new KeyNotFoundException("Category not found.");

            if (c.NewParentId == c.CategoryId) throw new InvalidOperationException("Category cannot be its own parent.");
            if (c.NewParentId is not null)
            {
                var parent = await db.Categories.FirstOrDefaultAsync(x => x.CategoryId == c.NewParentId && !x.IsDeleted, ct);
                if (parent is null) throw new InvalidOperationException("Parent category not found.");

                // detect cycles
                var map = await db.Categories
                    .Where(x => !x.IsDeleted)
                    .Select(x => new { x.CategoryId, x.ParentId })
                    .ToListAsync(ct);
                var p = c.NewParentId;
                while (p is not null)
                {
                    if (p == c.CategoryId) throw new InvalidOperationException("Cyclic parenting is not allowed.");
                    p = map.FirstOrDefault(x => x.CategoryId == p)?.ParentId;
                }
            }

            cat.ParentId = c.NewParentId;
            await db.SaveChangesAsync(ct);
        }
    }
}
