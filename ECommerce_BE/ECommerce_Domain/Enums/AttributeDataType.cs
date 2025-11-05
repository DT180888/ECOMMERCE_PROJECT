using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Domain.Enums
{
    public enum AttributeDataType : byte
    {
        Text = 0,
        Number = 1,
        Bool = 2,
        Date = 3,
        Select = 4,
        Multiselect = 5
    }
}
