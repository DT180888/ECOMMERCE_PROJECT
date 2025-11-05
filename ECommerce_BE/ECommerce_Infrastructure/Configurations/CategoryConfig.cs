using ECommerce_Domain.Entites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECommerce_Infrastructure.Configurations
{
    public sealed class CategoryConfig : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.ToTable("Categories", "ecom"); // schema ecom

            builder.HasKey(c => c.CategoryId);

            builder.Property(c => c.CategoryId)
                   .ValueGeneratedOnAdd();

            builder.Property(c => c.Name)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(c => c.Slug)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(c => c.IsDeleted)
                   .HasDefaultValue(false);

            builder.Property(c => c.CreatedAt)
                   // .HasColumnType("datetime") // Không cần thiết, DateTime mặc định là datetime2 hoặc datetime
                   .HasDefaultValueSql("GETDATE()"); // Hoặc "GETUTCDATE()" tùy theo nhu cầu của bạn

            builder.Property(c => c.UpdatedAt)
                   // .HasColumnType("datetime") // Không cần thiết
                   .IsRequired(false);

            builder.Property(c => c.RowVersion)
                   .IsRowVersion();

            // ---- Self reference ----
            builder.HasOne(c => c.Parent)
                   .WithMany(p => p.Children)
                   .HasForeignKey(c => c.ParentId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.Restrict);

            // ---- Indexes ----
            builder.HasIndex(c => c.Name)
                   .IsUnique();

            builder.HasIndex(c => c.Slug)
                   .IsUnique();

            // Optional: lọc theo IsDeleted cho query
            builder.HasQueryFilter(c => !c.IsDeleted);
        }
    }
}