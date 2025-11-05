using ECommerce_Application.Common.Interfaces;
using ECommerce_Domain.Entites;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Brands.Commands
{
    public sealed record CreateBrandCommand(string Name, string Slug) : IRequest<int>;

    public sealed class CreateBrandCommandHandler(IApplicationDbContext db)
        : IRequestHandler<CreateBrandCommand, int>
    {
        public async Task<int> Handle(CreateBrandCommand c, CancellationToken ct)
        {
            var exists = await db.Brands.AnyAsync(x => x.Name == c.Name || x.Slug == c.Slug, ct);
            if (exists) throw new InvalidOperationException("Brand name/slug already exists.");

            var brand = new Brand
            {
                Name = c.Name.Trim(),
                Slug = c.Slug.Trim(),
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            };

            db.Brands.Add(brand);
            await db.SaveChangesAsync(ct);
            return brand.BrandId;
        }
    }

}
