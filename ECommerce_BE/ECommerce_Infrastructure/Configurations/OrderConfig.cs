using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Configurations
{
    public class OrderConfig : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> b)
        {
            b.ToTable("Orders", "ecom");
            b.HasKey(o => o.OrderId);

            // Unique code cho đơn (nếu cần)
            b.Property(o => o.OrderNumber).IsRequired().HasMaxLength(50);
            b.HasIndex(o => o.OrderNumber).IsUnique();

            // Concurrency
            b.Property(o => o.RowVersion).IsRowVersion();

            // ===== Quan hệ BillTo =====
            b.HasOne(o => o.BillToAddress)
             .WithMany(a => a.OrderBillToAddresses)      // chỉ rõ navigation phía UserAddress
             .HasForeignKey(o => o.BillToAddressId)      // long?  ↔ long
             .HasConstraintName("FK_Orders_BillToAddress")
             .OnDelete(DeleteBehavior.Restrict);

            // ===== Quan hệ ShipTo =====
            b.HasOne(o => o.ShipToAddress)
             .WithMany(a => a.OrderShipToAddresses)      // chỉ rõ navigation phía UserAddress
             .HasForeignKey(o => o.ShipToAddressId)      // long?  ↔ long
             .HasConstraintName("FK_Orders_ShipToAddress")
             .OnDelete(DeleteBehavior.Restrict);

            // (gợi ý) chỉ định kiểu tiền tệ lưu ở minor units (đã là long)
            // b.Property(o => o.SubtotalMinor).IsRequired();
            // b.Property(o => o.TotalMinor);
            b.Property(o => o.AppliedPromotionCode).HasMaxLength(100);
            b.Property(o => o.AppliedCouponCode).HasMaxLength(100);
        }
    }
}
