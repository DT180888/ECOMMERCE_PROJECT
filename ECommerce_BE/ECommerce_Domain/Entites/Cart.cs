using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;
public partial class Cart
{
    public long CartId { get; set; }

    public string? UserId { get; set; }

    public byte Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

}
