using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Configurations
{

    public sealed class ProductCategoryConfig : IEntityTypeConfiguration<ProductCategory>
    {
        public void Configure(EntityTypeBuilder<ProductCategory> b)
        {
            b.ToTable("ProductCategory", "ecom"); // dùng đúng tên bảng hiện có

            // PK kép
            b.HasKey(x => new { x.ProductId, x.CategoryId });

            // Map tên cột DB (đang là ProductID/CategoryID)
            b.Property(x => x.ProductId).HasColumnName("ProductID");
            b.Property(x => x.CategoryId).HasColumnName("CategoryID");

            // Indexes (tùy chọn)
            b.HasIndex(x => x.ProductId);
            b.HasIndex(x => x.CategoryId);

            // FK → Product
            b.HasOne(x => x.Product)
             .WithMany(p => p.ProductCategories)      // nhớ Product có ICollection<ProductCategory>
             .HasForeignKey(x => x.ProductId)
             .OnDelete(DeleteBehavior.Cascade);       // hoặc Restrict theo policy của bạn

            // FK → Category
            b.HasOne(x => x.Category)
             .WithMany(c => c.ProductCategories)      // nhớ Category có ICollection<ProductCategory>
             .HasForeignKey(x => x.CategoryId)
             .OnDelete(DeleteBehavior.Cascade);       // hoặc Restrict
        }
    }
}