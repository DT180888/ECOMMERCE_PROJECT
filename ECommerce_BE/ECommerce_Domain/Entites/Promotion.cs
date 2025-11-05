using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;
public partial class Promotion
{
    public int PromotionId { get; set; }

    public string? Code { get; set; }

    public string Name { get; set; } = null!;

    public byte Type { get; set; }

    public int Value { get; set; }

    public DateTime? StartsAt { get; set; }

    public DateTime? EndsAt { get; set; }

    public bool IsActive { get; set; }

    public int? MaxRedemptions { get; set; }

    public int RedemptionsCount { get; set; }

    public virtual ICollection<Coupon> Coupons { get; set; } = new List<Coupon>();
}
