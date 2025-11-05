using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Configurations
{
    public class PromotionCategoryConfig : IEntityTypeConfiguration<PromotionCategory>
    {
        public void Configure(EntityTypeBuilder<PromotionCategory> b)
        {
            b.ToTable("PromotionCategories", "ecom");
            b.HasKey(x => new { x.PromotionId, x.CategoryId });

            b.HasOne<Promotion>()
             .WithMany()
             .HasForeignKey(x => x.PromotionId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne<Category>()
             .WithMany()
             .HasForeignKey(x => x.CategoryId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasIndex(x => x.CategoryId);
        }
    }
}
