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
    public sealed record UpdateBrandCommand(int BrandId, string Name, string Slug) : IRequest;

    public sealed class UpdateBrandCommandHandler(IApplicationDbContext db)
        : IRequestHandler<UpdateBrandCommand>
    {
        public async Task Handle(UpdateBrandCommand c, CancellationToken ct)
        {
            var brand = await db.Brands.FirstOrDefaultAsync(x => x.BrandId == c.BrandId && !x.IsDeleted, ct);
            if (brand is null) throw new KeyNotFoundException("Brand not found.");

            var duplicated = await db.Brands.AnyAsync(x =>
                x.BrandId != c.BrandId && (x.Name == c.Name || x.Slug == c.Slug), ct);

            if (duplicated) throw new InvalidOperationException("Brand name/slug already exists.");

            brand.Name = c.Name.Trim();
            brand.Slug = c.Slug.Trim();

            await db.SaveChangesAsync(ct);
        }
    }
}
