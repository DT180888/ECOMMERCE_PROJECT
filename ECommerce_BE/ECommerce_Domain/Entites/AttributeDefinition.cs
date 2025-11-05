using ECommerce_Domain.Enums;
using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;

public class AttributeDefinition
{
    public int AttributeId { get; set; }

    public string Name { get; set; } = null!;

    public string Slug { get; set; } = null!;          // ✅ để unique & friendly URL

    public AttributeDataType DataType { get; set; }                // ✅ dùng byte thay string, map enum AttributeDataType

    public string? Unit { get; set; }                  // ✅ đơn vị hiển thị (inch, GB...)

    public bool IsFilterable { get; set; }             // ✅ cho phép hiển thị trong bộ lọc (faceted search)

    public bool IsVariant { get; set; }                // ✅ dùng để tạo variant SKU (Color, Size,...)

    public bool IsDeleted { get; set; } = false;       // soft delete

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // ✅ thời gian tạo

    // Navigations
    public virtual ICollection<ProductAttributeValue> ProductAttributeValues { get; set; } = new List<ProductAttributeValue>();

    public virtual ICollection<SkuOptionValue> SkuOptionValues { get; set; } = new List<SkuOptionValue>();
}
