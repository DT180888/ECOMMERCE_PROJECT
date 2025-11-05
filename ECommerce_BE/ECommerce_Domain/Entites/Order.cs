using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;
public partial class Order
{
    public long OrderId { get; set; }

    public string OrderNumber { get; set; } = null!;

    public string? UserId { get; set; }

    public string? Email { get; set; }

    public byte Status { get; set; }

    public string Currency { get; set; } = null!;

    public long SubtotalMinor { get; set; }

    public long DiscountMinor { get; set; }

    public long TaxMinor { get; set; }

    public long ShippingMinor { get; set; }

    public long? TotalMinor { get; set; }

    public long? ShipToAddressId { get; set; }

    public long? BillToAddressId { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? PaidAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public byte[] RowVersion { get; set; } = null!;

    public virtual UserAddress? BillToAddress { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual UserAddress? ShipToAddress { get; set; }

    public virtual ICollection<Shipment> Shipments { get; set; } = new List<Shipment>();

    public string? AppliedPromotionCode { get; set; }
    public string? AppliedCouponCode { get; set; }
    public virtual ICollection<OrderPromotion> OrderPromotions { get; set; } = new List<OrderPromotion>();

}
