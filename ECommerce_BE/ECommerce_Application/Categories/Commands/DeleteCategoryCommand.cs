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
    public sealed record DeleteCategoryCommand(int CategoryId) : IRequest;

    public sealed class DeleteCategoryCommandHandler(IApplicationDbContext db)
      : IRequestHandler<DeleteCategoryCommand>
    {
        public async Task Handle(DeleteCategoryCommand c, CancellationToken ct)
        {
            var cat = await db.Categories.FirstOrDefaultAsync(x => x.CategoryId == c.CategoryId && !x.IsDeleted, ct);
            if (cat is null) return;

            // chặn xóa nếu còn con
            var hasChildren = await db.Categories.AnyAsync(x => x.ParentId == c.CategoryId && !x.IsDeleted, ct);
            if (hasChildren) throw new InvalidOperationException("Cannot delete a category that has children.");

            // chặn xóa nếu còn liên kết sản phẩm
            var hasProducts = await db.ProductCategories.AnyAsync(x => x.CategoryId == c.CategoryId, ct);
            if (hasProducts) throw new InvalidOperationException("Cannot delete a category that has products.");

            cat.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }
}
