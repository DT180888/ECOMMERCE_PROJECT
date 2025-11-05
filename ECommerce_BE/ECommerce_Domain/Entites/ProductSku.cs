using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Domain.Entites
{
    public class ProductSku
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public string SkuCode { get; set; } = null!;
        public long PriceMinor { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
