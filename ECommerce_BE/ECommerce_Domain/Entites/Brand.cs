using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;
public partial class Brand
{
    public int BrandId { get; set; }

    public string Name { get; set; } = null!;
    public string Slug { get; set; } = null!;

    public bool IsDeleted { get; set; }

    public byte[] RowVersion { get; set; } = null!;   // concurrency token

    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }

    // ✅ Navigation – chỉ thêm, không đổi schema cũ
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
