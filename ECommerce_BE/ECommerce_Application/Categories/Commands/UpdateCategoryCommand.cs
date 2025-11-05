using ECommerce_Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Categories.Commands
{
    public sealed record UpdateCategoryCommand(int CategoryId, string Name, string Slug, int? ParentId) : IRequest;

    public sealed class UpdateCategoryCommandHandler(IApplicationDbContext db)
      : IRequestHandler<UpdateCategoryCommand>
    {
        public async Task Handle(UpdateCategoryCommand c, CancellationToken ct)
        {
            var cat = await db.Categories.FirstOrDefaultAsync(x => x.CategoryId == c.CategoryId && !x.IsDeleted, ct);
            if (cat is null) throw new KeyNotFoundException("Category not found.");

            // unique name/slug (exclude self)
            var dup = await db.Categories.AnyAsync(x => x.CategoryId != c.CategoryId && (x.Name == c.Name || x.Slug == c.Slug), ct);
            if (dup) throw new InvalidOperationException("Category name/slug already exists.");

            // validate parent & avoid cycles
            if (c.ParentId == c.CategoryId) throw new InvalidOperationException("Category cannot be its own parent.");
            if (c.ParentId is not null)
            {
                var parent = await db.Categories.FirstOrDefaultAsync(x => x.CategoryId == c.ParentId && !x.IsDeleted, ct);
                if (parent is null) throw new InvalidOperationException("Parent category not found.");

                // detect cycle: check if new parent is descendant of current node
                var map = await db.Categories
                    .Where(x => !x.IsDeleted)
                    .Select(x => new { x.CategoryId, x.ParentId })
                    .ToListAsync(ct);

                var parentId = c.ParentId;
                while (parentId is not null)
                {
                    if (parentId == c.CategoryId)
                        throw new InvalidOperationException("Cyclic parenting is not allowed.");
                    parentId = map.FirstOrDefault(x => x.CategoryId == parentId)?.ParentId;
                }
            }

            cat.Name = c.Name.Trim();
            cat.Slug = c.Slug.Trim();
            cat.ParentId = c.ParentId;

            await db.SaveChangesAsync(ct);
        }
    }
}
