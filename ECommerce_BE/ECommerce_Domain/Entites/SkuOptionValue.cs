using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;
public partial class SkuOptionValue
{
    public long SkuId { get; set; }

    public int AttributeId { get; set; }

    public string Value { get; set; } = null!;

    public virtual AttributeDefinition Attribute { get; set; } = null!;
}
