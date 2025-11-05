using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;
public partial class UserAddress
{
    public long AddressId { get; set; }

    public string UserId { get; set; } = null!;

    public string? Label { get; set; }

    public string RecipientName { get; set; } = null!;

    public string? Phone { get; set; }

    public string Line1 { get; set; } = null!;

    public string? Line2 { get; set; }

    public string City { get; set; } = null!;

    public string? State { get; set; }

    public string? PostalCode { get; set; }

    public string Country { get; set; } = null!;

    public bool IsDefault { get; set; }

    public bool IsDeleted { get; set; }

    public byte[] RowVersion { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? UpdatedBy { get; set; }

    public virtual ICollection<Order> OrderBillToAddresses { get; set; } = new List<Order>();

    public virtual ICollection<Order> OrderShipToAddresses { get; set; } = new List<Order>();

}
