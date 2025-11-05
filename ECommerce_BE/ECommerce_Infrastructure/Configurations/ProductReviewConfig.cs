using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.AspNetCore.Identity;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Configurations
{
    public class ProductReviewConfig : IEntityTypeConfiguration<ProductReview>
    {
        public void Configure(EntityTypeBuilder<ProductReview> b)
        {
            b.ToTable("ProductReview", "ecom");
            b.HasKey(x => x.ReviewId);

            // Cột/giới hạn
            b.Property(x => x.Rating).IsRequired();                 // byte 1–5 (có thể ràng buộc check ở DB nếu muốn)
            b.Property(x => x.Title).HasMaxLength(200);
            b.Property(x => x.IsApproved).HasDefaultValue(false);

            // FK tới Product
            b.HasOne<Product>()
             .WithMany()
             .HasForeignKey(x => x.ProductId)
             .OnDelete(DeleteBehavior.Cascade);

            // FK tới AspNetUsers (UserId) – shadow IdentityUser
            b.HasOne<IdentityUser>()
             .WithMany()
             .HasForeignKey(x => x.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            // Tối ưu tra cứu
            b.HasIndex(x => new { x.ProductId, x.IsApproved, x.Rating });
        }
    }
}
