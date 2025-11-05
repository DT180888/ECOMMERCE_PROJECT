using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Domain.Entites
{
    public class Product
    {
        public long ProductID { get; set; }          // GIỮ NGUYÊN tên hiện tại để không vỡ snapshot/migration
        public string Name { get; set; } = null!;
        public string Slug { get; set; } = null!;
        public string? Description { get; set; }
        public byte Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }     // ✅ thêm — cần migration
        public bool IsDeleted { get; set; } = false;

        public int? BrandId { get; set; }
        public Brand? Brand { get; set; }

        // ✅ Navigation collections (chỉ thêm — KHÔNG đổi schema)
        public ICollection<ProductSku> ProductSkus { get; set; } = new List<ProductSku>();
        public ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
        public ICollection<ProductCategory> ProductCategories { get; set; } = new List<ProductCategory>();
        public ICollection<ProductAttributeValue> ProductAttributeValues { get; set; } = new List<ProductAttributeValue>();
    }
}
