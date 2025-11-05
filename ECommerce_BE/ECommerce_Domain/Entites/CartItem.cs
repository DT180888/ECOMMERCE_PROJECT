using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;
public partial class CartItem
{
    public long CartItemId { get; set; }

    public long CartId { get; set; }

    public long SkuId { get; set; }

    public int Qty { get; set; }

    public long PriceMinor { get; set; }

    public DateTime AddedAt { get; set; }

    public virtual Cart Cart { get; set; } = null!;

}
