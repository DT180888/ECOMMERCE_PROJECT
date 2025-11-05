using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Domain.Entites
{
    public class CouponRedemption
    {
        public int CouponId { get; set; }
        public string UserId { get; set; } = null!;
        public DateTime RedeemedAt { get; set; }
        public long DiscountMinor { get; set; }
    }
}
