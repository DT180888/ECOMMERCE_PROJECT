using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Configurations
{
    public class PromotionProductConfig : IEntityTypeConfiguration<PromotionProduct>
    {
        public void Configure(EntityTypeBuilder<PromotionProduct> b)
        {
            b.ToTable("PromotionProducts", "ecom");
            b.HasKey(x => new { x.PromotionId, x.ProductId });

            b.HasOne<Promotion>()
             .WithMany()
             .HasForeignKey(x => x.PromotionId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne<Product>()
             .WithMany()
             .HasForeignKey(x => x.ProductId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasIndex(x => x.ProductId);
        }
    }
}
