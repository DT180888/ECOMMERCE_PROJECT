using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Configurations
{
    public class OrderPromotionConfig : IEntityTypeConfiguration<OrderPromotion>
    {
        public void Configure(EntityTypeBuilder<OrderPromotion> b)
        {
            b.ToTable("OrderPromotions", "ecom");
            b.HasKey(x => new { x.OrderId, x.PromotionId });

            b.Property(x => x.DiscountMinor).IsRequired();

            b.HasOne<Order>()
             .WithMany(o => o.OrderPromotions)
             .HasForeignKey(x => x.OrderId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne<Promotion>()
             .WithMany()
             .HasForeignKey(x => x.PromotionId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(x => x.PromotionId);
        }
    }
}
