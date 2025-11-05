using ECommerce_Domain.Entites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Infrastructure.Configurations
{
    public class CouponConfig : IEntityTypeConfiguration<Coupon>
    {
        public void Configure(EntityTypeBuilder<Coupon> b)
        {
            b.ToTable("Coupons", "ecom");
            b.HasKey(x => x.CouponId);

            b.Property(x => x.Code).IsRequired().HasMaxLength(100);

            // CHỈ 1 cấu hình quan hệ này — không thêm quan hệ khác tới Promotion
            b.HasOne(c => c.Promotion)
             .WithMany(p => p.Coupons)               // hoặc .WithMany() nếu không dùng collection
             .HasForeignKey(c => c.PromotionId)
             .OnDelete(DeleteBehavior.Cascade);

            // Code duy nhất trong phạm vi 1 promotion (khuyến nghị)
            b.HasIndex(x => new { x.PromotionId, x.Code }).IsUnique();

            // (tuỳ chọn) nếu muốn Code global unique
            // b.HasIndex(x => x.Code).IsUnique();
        }
    }
}
