using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Configurations
{
    public class OrderItemConfig : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> b)
        {
            b.ToTable("OrderItems", "ecom");
            b.HasKey(x => x.OrderItemId);

            // OrderItem (n) -> (1) Order  (dùng đúng navigation OrderItems bạn đã có)
            b.HasOne(oi => oi.Order)
             .WithMany(o => o.OrderItems)
             .HasForeignKey(oi => oi.OrderId)
             .OnDelete(DeleteBehavior.Cascade);

            // Tham chiếu SKU; Restrict để giữ lịch sử đơn khi xoá SKU
            b.HasOne<ProductSku>()
             .WithMany()
             .HasForeignKey(oi => oi.SkuId)
             .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
