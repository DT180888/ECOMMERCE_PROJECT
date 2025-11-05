using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Configurations
{
    public class ProductAttributeValueConfig : IEntityTypeConfiguration<ProductAttributeValue>
    {
        public void Configure(EntityTypeBuilder<ProductAttributeValue> b)
        {
            b.ToTable("ProductAttributeValues", "ecom"); // hoặc "ProductAttributeValue" đúng theo DB bạn

            // PK kép
            b.HasKey(x => new { x.ProductId, x.AttributeId });

            // Map tên cột DB hiện có
            b.Property(x => x.ProductId).HasColumnName("ProductID");     // ✅ quan trọng
            b.Property(x => x.AttributeId).HasColumnName("AttributeID"); // nếu DB dùng AttributeID

            // Precision
            b.Property(x => x.ValueNumber).HasPrecision(18, 2);

            // FK -> Product
            b.HasOne(x => x.Product)
             .WithMany(p => p.ProductAttributeValues)
             .HasForeignKey(x => x.ProductId)
             .OnDelete(DeleteBehavior.Cascade);

            // FK -> AttributeDefinition
            b.HasOne(x => x.Attribute)
             .WithMany(a => a.ProductAttributeValues)
             .HasForeignKey(x => x.AttributeId)
             .OnDelete(DeleteBehavior.Restrict);

            // Matching filter với AttributeDefinition.IsDeleted (nếu principal có soft delete)
            b.HasQueryFilter(x => !x.Attribute.IsDeleted);

            // (tuỳ chọn) index
            b.HasIndex(x => x.AttributeId);
        }
    }
}
