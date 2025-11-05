using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Configurations
{
    public class InventoryConfig : IEntityTypeConfiguration<Inventory>
    {
        public void Configure(EntityTypeBuilder<Inventory> b)
        {
            b.ToTable("Inventory", "ecom");

            // 👇 Khóa chính
            b.HasKey(x => x.SkuId);
            b.Property(x => x.SkuId).ValueGeneratedNever(); // vì là PK cũng đồng thời là FK 1–1

            // (Khuyến nghị) Ràng buộc 1–1 với ProductSku theo SkuId
            b.HasOne<ProductSku>()
             .WithOne()
             .HasForeignKey<Inventory>(x => x.SkuId)
             .OnDelete(DeleteBehavior.Cascade);

            // (Tuỳ chọn) các cột số
            b.Property(x => x.QuantityOnHand).HasDefaultValue(0);
            b.Property(x => x.QuantityReserved).HasDefaultValue(0);
        }
    }
}

