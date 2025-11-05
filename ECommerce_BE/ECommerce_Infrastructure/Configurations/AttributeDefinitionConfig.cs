using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Configurations
{
    public sealed class AttributeDefinitionConfig : IEntityTypeConfiguration<AttributeDefinition>
    {
        public void Configure(EntityTypeBuilder<AttributeDefinition> builder)
        {
            builder.ToTable("AttributeDefinitions", "ecom");

            builder.HasKey(a => a.AttributeId);
            builder.Property(a => a.AttributeId).ValueGeneratedOnAdd();

            builder.Property(a => a.Name)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(a => a.Slug)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(a => a.DataType)
                   .IsRequired();

            builder.Property(a => a.Unit)
                   .HasMaxLength(50);

            builder.Property(a => a.IsFilterable).HasDefaultValue(false);
            builder.Property(a => a.IsVariant).HasDefaultValue(false);
            builder.Property(a => a.IsDeleted).HasDefaultValue(false);

            builder.Property(a => a.CreatedAt)
                   .HasColumnType("datetime2")
                   .HasDefaultValueSql("GETUTCDATE()");

            builder.HasIndex(a => a.Name).IsUnique();
            builder.HasIndex(a => a.Slug).IsUnique();

            builder.HasQueryFilter(a => !a.IsDeleted);
        }
    }
}
