using ECommerce_Domain.Entites;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using S = ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Persistence;

public partial class AppDbContext : IdentityDbContext<IdentityUser, IdentityRole, string>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductSku> ProductSkus => Set<ProductSku>();
    public DbSet<AttributeDefinition> AttributeDefinitions => Set<AttributeDefinition>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<Inventory> Inventories => Set<Inventory>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<ProductAttributeValue> ProductAttributeValues => Set<ProductAttributeValue>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<ProductReview> ProductReviews => Set<ProductReview>();
    public DbSet<Promotion> Promotions => Set<Promotion>();
    public DbSet<Shipment> Shipments => Set<Shipment>();
    public DbSet<SkuOptionValue> SkuOptionValues => Set<SkuOptionValue>();
    public DbSet<UserAddress> UserAddresses => Set<UserAddress>();
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<ProductCategory> ProductCategories => Set<ProductCategory>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<PromotionProduct> PromotionProducts => Set<PromotionProduct>();
    public DbSet<PromotionCategory> PromotionCategories => Set<PromotionCategory>();
    public DbSet<OrderPromotion> OrderPromotions => Set<OrderPromotion>();
    public DbSet<CouponRedemption> CouponRedemptions => Set<CouponRedemption>();


    protected override void OnModelCreating(ModelBuilder b)
    {
        base.OnModelCreating(b);

        // Schema mặc định cho domain
        b.HasDefaultSchema("ecom");

        // Map Identity sang schema dbo
        b.Entity<IdentityUser>().ToTable("AspNetUsers", "dbo");
        b.Entity<IdentityRole>().ToTable("AspNetRoles", "dbo");
        b.Entity<IdentityUserRole<string>>().ToTable("AspNetUserRoles", "dbo");
        b.Entity<IdentityUserClaim<string>>().ToTable("AspNetUserClaims", "dbo");
        b.Entity<IdentityRoleClaim<string>>().ToTable("AspNetRoleClaims", "dbo");
        b.Entity<IdentityUserLogin<string>>().ToTable("AspNetUserLogins", "dbo");
        b.Entity<IdentityUserToken<string>>().ToTable("AspNetUserTokens", "dbo");

        // RefreshToken (Domain entity, shadow nav tới AspNetUsers)
        b.Entity<RefreshToken>(e =>
        {
            e.ToTable("RefreshTokens", "ecom");
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.TokenHash).IsUnique();
            e.Property(x => x.TokenHash).IsRequired();
            e.Property(x => x.UserId).HasMaxLength(450);

            e.HasOne<IdentityUser>()
             .WithMany()
             .HasForeignKey(x => x.UserId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Áp dụng tất cả Fluent Configurations từ Assembly
        b.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }

}
