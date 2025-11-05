using ECommerce_Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Products.Commands
{
    public sealed record DeleteProductCommand(long ProductId) : IRequest;

    public sealed class DeleteProductCommandHandler(IApplicationDbContext db) : IRequestHandler<DeleteProductCommand>
    {
        public async Task Handle(DeleteProductCommand c, CancellationToken ct)
        {
            var p = await db.Products.FirstOrDefaultAsync(x => x.ProductID == c.ProductId && !x.IsDeleted, ct);
            if (p is null) return; // idempotent
            p.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }
}
