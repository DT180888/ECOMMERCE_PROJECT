using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;
public partial class OrderItem
{
    public long OrderItemId { get; set; }

    public long OrderId { get; set; }

    public long SkuId { get; set; }

    public string ProductName { get; set; } = null!;

    public string? SkuName { get; set; }

    public int Qty { get; set; }

    public long UnitPriceMinor { get; set; }

    public long DiscountMinor { get; set; }

    public long TaxMinor { get; set; }

    public long? LineTotalMinor { get; set; }

    public virtual Order Order { get; set; } = null!;

}
