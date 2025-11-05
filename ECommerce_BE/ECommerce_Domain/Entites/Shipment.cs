using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;
public partial class Shipment
{
    public long ShipmentId { get; set; }

    public long OrderId { get; set; }

    public string Carrier { get; set; } = null!;

    public string? ServiceCode { get; set; }

    public string? TrackingNumber { get; set; }

    public byte Status { get; set; }

    public DateTime? ShippedAt { get; set; }

    public DateTime? DeliveredAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Order Order { get; set; } = null!;
}
