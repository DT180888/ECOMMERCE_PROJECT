using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;
public partial class UserProfile
{
    public string UserId { get; set; } = null!;

    public string? FullName { get; set; }

    public string? Phone { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public byte[] RowVersion { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? UpdatedBy { get; set; }

}
