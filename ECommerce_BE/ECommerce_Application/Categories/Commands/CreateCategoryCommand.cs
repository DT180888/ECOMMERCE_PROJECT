using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ECommerce_Application.Common.Interfaces;
using ECommerce_Domain.Entites;

namespace ECommerce_Application.Categories.Commands
{
    public sealed record CreateCategoryCommand(string Name, string Slug, int? ParentId) : IRequest<int>;

    public sealed class CreateCategoryCommandHandler(IApplicationDbContext db)
      : IRequestHandler<CreateCategoryCommand, int>
    {
        public async Task<int> Handle(CreateCategoryCommand c, CancellationToken ct)
        {
            // unique name/slug
            var exists = await db.Categories.AnyAsync(x => x.Name == c.Name || x.Slug == c.Slug, ct);
            if (exists) throw new InvalidOperationException("Category name/slug already exists.");

            // validate parent
            if (c.ParentId is not null)
            {
                var parentExists = await db.Categories.AnyAsync(x => x.CategoryId == c.ParentId && !x.IsDeleted, ct);
                if (!parentExists) throw new InvalidOperationException("Parent category not found.");
            }

            var e = new Category
            {
                Name = c.Name.Trim(),
                Slug = c.Slug.Trim(),
                ParentId = c.ParentId,
                IsDeleted = false,
                CreatedAt = DateTime.UtcNow
            };
            db.Categories.Add(e);
            await db.SaveChangesAsync(ct);
            return e.CategoryId;
        }
    }
}
