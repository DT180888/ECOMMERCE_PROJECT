using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ECommerce_Domain.Entites; // TEMP dependency until entities are moved to Domain


namespace ECommerce_Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Brand> Brands { get; }

        DbSet<Category> Categories { get; }
        DbSet<ProductCategory> ProductCategories { get; }
        DbSet<Product> Products { get; }
        DbSet<ProductImage> ProductImages { get; }
        DbSet<Inventory> Inventories { get; }
        DbSet<ProductAttributeValue> ProductAttributeValues { get; }
        DbSet<AttributeDefinition> AttributeDefinitions { get; }
        // TODO: add other DbSet<> when you implement their modules (Categories, Products, ...)
        DbSet<RefreshToken> RefreshTokens { get; }

        DbSet<ProductSku> ProductSkus { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}