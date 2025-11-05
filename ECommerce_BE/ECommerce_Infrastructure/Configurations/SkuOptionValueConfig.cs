using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Configurations
{
    public class SkuOptionValueConfig : IEntityTypeConfiguration<SkuOptionValue>
    {
        public void Configure(EntityTypeBuilder<SkuOptionValue> b)
        {
            b.ToTable("SkuOptionValues", "ecom"); // số nhiều cho đồng nhất

            // PK kép theo SkuId + AttributeId (mỗi SKU có 1 giá trị cho 1 attribute-variant)
            b.HasKey(x => new { x.SkuId, x.AttributeId });

            b.Property(x => x.Value)
             .IsRequired()
             .HasMaxLength(200);

            // FK -> ProductSkus
            b.HasOne<ProductSku>()
             .WithMany()
             .HasForeignKey(x => x.SkuId)
             .OnDelete(DeleteBehavior.Restrict); // tránh cascade khi xoá SKU

            // FK -> AttributeDefinitions
            // navigation trong SkuOptionValue phải là 'Attribute' (kiểu AttributeDefinition)
            b.HasOne(x => x.Attribute)
             .WithMany(a => a.SkuOptionValues)
             .HasForeignKey(x => x.AttributeId)
             .OnDelete(DeleteBehavior.Restrict);

            // MATCHING FILTER: ẩn option nếu attribute bị soft-delete
            b.HasQueryFilter(x => !x.Attribute.IsDeleted);

            // (Tuỳ chọn) Index phục vụ lọc theo attribute
            b.HasIndex(x => x.AttributeId);
        }
    }
}
