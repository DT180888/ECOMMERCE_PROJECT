using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Configurations
{
    public class CouponRedemptionConfig : IEntityTypeConfiguration<CouponRedemption>
    {
        public void Configure(EntityTypeBuilder<CouponRedemption> b)
        {
            b.ToTable("CouponRedemptions", "ecom");
            b.HasKey(x => new { x.CouponId, x.UserId }); // một user redeem 1 coupon tối đa 1 lần

            b.Property(x => x.DiscountMinor).IsRequired();
            b.Property(x => x.RedeemedAt).HasDefaultValueSql("sysutcdatetime()");

            b.HasOne<Coupon>()
             .WithMany()
             .HasForeignKey(x => x.CouponId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne<IdentityUser>()              // dbo.AspNetUsers
             .WithMany()
             .HasForeignKey(x => x.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasIndex(x => x.UserId);
        }
    }
}
