using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ECommerce_Domain.Entites;

namespace ECommerce_Infrastructure.Configurations
{
    public class CartItemConfig : IEntityTypeConfiguration<CartItem>
    {
        public void Configure(EntityTypeBuilder<CartItem> b)
        {
            b.ToTable("CartItems", "ecom");
            b.HasKey(x => x.CartItemId);

            // CartItem (n) -> (1) Cart  (dùng đúng navigation CartItems bạn đã có)
            b.HasOne(ci => ci.Cart)
             .WithMany(c => c.CartItems)
             .HasForeignKey(ci => ci.CartId)
             .OnDelete(DeleteBehavior.Cascade);

            // SKU bắt buộc thuộc 1 ProductSku
            b.HasOne<ProductSku>()
             .WithMany()
             .HasForeignKey(ci => ci.SkuId)
             .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
