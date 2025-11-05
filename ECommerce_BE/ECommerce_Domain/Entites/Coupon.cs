using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;
public partial class Coupon
{
    public int CouponId { get; set; }

    public string Code { get; set; } = null!;

    public int PromotionId { get; set; }

    public bool IsRedeemed { get; set; }

    public string? RedeemedBy { get; set; }

    public DateTime? RedeemedAt { get; set; }

    public virtual Promotion Promotion { get; set; } = null!;
}
