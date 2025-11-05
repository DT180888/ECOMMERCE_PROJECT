using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ECommerce_Application.Common.Interfaces;
using ECommerce_Domain.Entites;


namespace ECommerce_Infrastructure.Persistence;

public partial class AppDbContext : IApplicationDbContext
{
    DbSet<Brand> IApplicationDbContext.Brands => Brands;
    DbSet<Category> IApplicationDbContext.Categories => Categories;
    DbSet<ProductCategory> IApplicationDbContext.ProductCategories => ProductCategories;
    DbSet<Product> IApplicationDbContext.Products => Products;
    DbSet<ProductSku> IApplicationDbContext.ProductSkus => ProductSkus;
    DbSet<ProductImage> IApplicationDbContext.ProductImages => ProductImages;
    DbSet<Inventory> IApplicationDbContext.Inventories => Inventories;
    DbSet<RefreshToken> IApplicationDbContext.RefreshTokens => RefreshTokens;
    DbSet<ProductAttributeValue> IApplicationDbContext.ProductAttributeValues => ProductAttributeValues;
    DbSet<AttributeDefinition> IApplicationDbContext.AttributeDefinitions => AttributeDefinitions;

    Task<int> IApplicationDbContext.SaveChangesAsync(CancellationToken cancellationToken)
    => base.SaveChangesAsync(cancellationToken);
}