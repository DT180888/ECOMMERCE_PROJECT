using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Domain.Entites
{
    public class OrderPromotion
    {
        public long OrderId { get; set; }
        public int PromotionId { get; set; }
        public long DiscountMinor { get; set; } // snapshot số tiền giảm
    }
}