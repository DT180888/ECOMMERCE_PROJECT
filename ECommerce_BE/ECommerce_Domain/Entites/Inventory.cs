using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;
public partial class Inventory
{
    public long SkuId { get; set; }

    public int QuantityOnHand { get; set; }

    public int QuantityReserved { get; set; }

    public int ReorderPoint { get; set; }

    public DateTime UpdatedAt { get; set; }

}
