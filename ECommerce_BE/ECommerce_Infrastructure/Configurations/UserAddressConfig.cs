using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.AspNetCore.Identity;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Configurations
{
    public class UserAddressConfig : IEntityTypeConfiguration<UserAddress>
    {
        public void Configure(EntityTypeBuilder<UserAddress> b)
        {
            b.ToTable("UserAddress", "ecom");
            b.HasKey(x => x.AddressId);

            // Concurrency
            b.Property(x => x.RowVersion).IsRowVersion();

            // Lengths/required
            b.Property(x => x.Label).HasMaxLength(100);
            b.Property(x => x.RecipientName).IsRequired().HasMaxLength(150);
            b.Property(x => x.Phone).HasMaxLength(30);
            b.Property(x => x.Line1).IsRequired().HasMaxLength(200);
            b.Property(x => x.Line2).HasMaxLength(200);
            b.Property(x => x.City).IsRequired().HasMaxLength(100);
            b.Property(x => x.State).HasMaxLength(100);
            b.Property(x => x.PostalCode).HasMaxLength(20);
            b.Property(x => x.Country).IsRequired().HasMaxLength(100);
            b.Property(x => x.IsDefault).HasDefaultValue(false);
            b.Property(x => x.IsDeleted).HasDefaultValue(false);
            b.Property(x => x.CreatedAt).HasDefaultValueSql("sysutcdatetime()");

            // FK tới AspNetUsers
            b.HasOne<IdentityUser>()
             .WithMany()
             .HasForeignKey(x => x.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            // Index giúp tìm theo User
            b.HasIndex(x => new { x.UserId, x.IsDefault });

            // (Tuỳ chọn) unique default per user (filtered)
            // b.HasIndex(x => new { x.UserId, x.IsDefault })
            //  .HasFilter("[IsDefault] = 1")
            //  .IsUnique();

            // Hai navigation tới Order đã cấu hình ở OrderConfig (BillTo/ShipTo)
        }
    }
}
