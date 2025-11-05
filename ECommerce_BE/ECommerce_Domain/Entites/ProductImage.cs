using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;

public partial class ProductImage
{
    public long ImageId { get; set; }

    public long ProductId { get; set; }

    public string Url { get; set; } = null!;

    public bool IsPrimary { get; set; }

    public int SortOrder { get; set; }

    public DateTime CreatedAt { get; set; }

    public bool IsDeleted { get; set; } = false;   // ✅ thêm

    public Product Product { get; set; } = null!;
}
