using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce_Domain.Entites;


namespace ECommerce_Infrastructure.Configurations
{
    public sealed class BrandConfig : IEntityTypeConfiguration<Brand>
    {
        public void Configure(EntityTypeBuilder<Brand> b)
        {
            b.ToTable("Brands", "ecom");

            b.HasKey(x => x.BrandId);

            b.Property(x => x.Name)
             .IsRequired()
             .HasMaxLength(200);

            b.Property(x => x.Slug)
             .IsRequired()
             .HasMaxLength(200);

            // Concurrency
            b.Property(x => x.RowVersion)
             .IsRowVersion();

            // Auditing
            b.Property(x => x.CreatedAt)
             .HasColumnType("datetime2")
             .HasDefaultValueSql("GETUTCDATE()");

            b.Property(x => x.UpdatedAt)
             .HasColumnType("datetime2")
             .IsRequired(false);

            // Indexes & uniqueness
            b.HasIndex(x => x.Name).IsUnique();
            b.HasIndex(x => x.Slug).IsUnique();

            // Soft delete filter
            b.HasQueryFilter(x => !x.IsDeleted);

            // Relation with Product (phù hợp với Product.BrandId nullable)
            b.HasMany(x => x.Products)
             .WithOne(p => p.Brand)
             .HasForeignKey(p => p.BrandId)
             .OnDelete(DeleteBehavior.SetNull);
        }
    }
}