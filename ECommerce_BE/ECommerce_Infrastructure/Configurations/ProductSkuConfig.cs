using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Configurations;

public class ProductSkuConfig : IEntityTypeConfiguration<ProductSku>
{
    public void Configure(EntityTypeBuilder<ProductSku> b)
    {
        b.ToTable("ProductSkus", "ecom");
        b.HasKey(x => x.Id);

        b.Property(x => x.ProductId)
         .HasColumnName("ProductID");

        b.HasOne<Product>()                      // SKU thuộc 1 Product
         .WithMany()                             // (nếu chưa có navigation Product.Skus)
         .HasForeignKey(x => x.ProductId)
         .OnDelete(DeleteBehavior.Cascade);
    }
}
