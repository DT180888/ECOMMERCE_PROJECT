using ECommerce_Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Brands.Commands
{
    public sealed record DeleteBrandCommand(int BrandId) : IRequest;

    public sealed class DeleteBrandCommandHandler(IApplicationDbContext db)
        : IRequestHandler<DeleteBrandCommand>
    {
        public async Task Handle(DeleteBrandCommand c, CancellationToken ct)
        {
            var brand = await db.Brands.FirstOrDefaultAsync(x => x.BrandId == c.BrandId && !x.IsDeleted, ct);
            if (brand is null) return; // idempotent

            brand.IsDeleted = true;
            await db.SaveChangesAsync(ct);
        }
    }
}
