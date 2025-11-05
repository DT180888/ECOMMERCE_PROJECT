using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;
public partial class Payment
{
    public long PaymentId { get; set; }

    public long OrderId { get; set; }

    public string Provider { get; set; } = null!;

    public string? ProviderRef { get; set; }

    public long AmountMinor { get; set; }

    public byte Status { get; set; }

    public DateTime? PaidAt { get; set; }

    public string? RawPayload { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Order Order { get; set; } = null!;
}
