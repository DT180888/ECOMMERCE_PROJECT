using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Configurations
{
    public sealed class ProductImageConfig : IEntityTypeConfiguration<ProductImage>
    {
        public void Configure(EntityTypeBuilder<ProductImage> b)
        {
            b.ToTable("ProductImage", "ecom");

            b.HasKey(x => x.ImageId);

            b.Property(x => x.ProductId)
             .HasColumnName("ProductID");

            b.Property(x => x.Url)
             .IsRequired()
             .HasMaxLength(1000);

            b.Property(x => x.SortOrder)
             .HasDefaultValue(0);

            b.Property(x => x.CreatedAt)
             .HasColumnType("datetime2")
             .HasDefaultValueSql("GETUTCDATE()");

            b.Property(x => x.IsDeleted)
             .HasDefaultValue(false);

            b.HasQueryFilter(x => !x.IsDeleted); // ✅ ẩn ảnh đã xoá

            b.HasIndex(x => x.ProductId);

            b.HasOne(x => x.Product)
             .WithMany(p => p.ProductImages)
             .HasForeignKey(x => x.ProductId)
             .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
