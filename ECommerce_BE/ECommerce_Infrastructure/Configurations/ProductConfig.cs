using ECommerce_Domain.Entites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Infrastructure.Configurations
{
    public class ProductConfig : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> b)
        {
            b.ToTable("Products", "ecom");
            b.HasKey(x => x.ProductID);

            b.Property(x => x.Name).IsRequired().HasMaxLength(250);
            b.Property(x => x.Slug).IsRequired().HasMaxLength(250);
            b.Property(x => x.Description).HasMaxLength(4000);
            b.Property(x => x.CreatedAt).HasColumnType("datetime2").HasDefaultValueSql("GETUTCDATE()");
            b.Property(x => x.UpdatedAt).HasColumnType("datetime2").IsRequired(false);
            b.Property(x => x.IsDeleted).HasDefaultValue(false);

            b.HasIndex(x => x.Slug).IsUnique();
            b.HasIndex(x => x.Name);

            // Brand (FK nullable)
            b.HasOne(p => p.Brand)
             .WithMany(br => br.Products)     // đảm bảo Brand có ICollection<Product> Products
             .HasForeignKey(p => p.BrandId)
             .OnDelete(DeleteBehavior.SetNull);

            // Query filter soft-delete
            b.HasQueryFilter(p => !p.IsDeleted);
        }
    }
}
