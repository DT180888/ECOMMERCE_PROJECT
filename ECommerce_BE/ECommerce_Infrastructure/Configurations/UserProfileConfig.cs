using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.AspNetCore.Identity;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Configurations
{
    public class UserProfileConfig : IEntityTypeConfiguration<UserProfile>
    {
        public void Configure(EntityTypeBuilder<UserProfile> b)
        {
            b.ToTable("UserProfile", "ecom");

            // PK cũng là FK 1–1 tới AspNetUsers
            b.HasKey(x => x.UserId);

            b.Property(x => x.RowVersion).IsRowVersion();
            b.Property(x => x.FullName).HasMaxLength(150);
            b.Property(x => x.Phone).HasMaxLength(30);
            b.Property(x => x.CreatedAt).HasDefaultValueSql("sysutcdatetime()");

            // DateOnly map mặc định sang date (SQL Server hỗ trợ kiểu date)
            b.Property(x => x.DateOfBirth).HasColumnType("date");

            // 1–1 tới AspNetUsers (shadow nav)
            b.HasOne<IdentityUser>()
             .WithOne()
             .HasForeignKey<UserProfile>(x => x.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            // Index phụ trợ
            b.HasIndex(x => x.Phone);
        }
    }
}
