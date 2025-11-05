using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;
public partial class ProductAttributeValue
{
    public long ProductId { get; set; }

    public int AttributeId { get; set; }

    public string? ValueText { get; set; }

    public decimal? ValueNumber { get; set; }

    public bool? ValueBool { get; set; }

    public Product Product { get; set; } = null!;
    public virtual AttributeDefinition Attribute { get; set; } = null!;

}
