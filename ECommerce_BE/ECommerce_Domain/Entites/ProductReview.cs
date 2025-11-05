using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;
public partial class ProductReview
{
    public long ReviewId { get; set; }

    public long ProductId { get; set; }

    public string UserId { get; set; } = null!;

    public byte Rating { get; set; }

    public string? Title { get; set; }

    public string? Content { get; set; }

    public bool IsApproved { get; set; }

    public DateTime CreatedAt { get; set; }

}
