using System;
using System.Collections.Generic;

namespace ECommerce_Domain.Entites;

public partial class Category
{
    public int CategoryId { get; set; }

    public int? ParentId { get; set; }

    public string Name { get; set; } = null!;

    public string Slug { get; set; } = null!;

    public bool IsDeleted { get; set; }

    public byte[] RowVersion { get; set; } = null!;

    public DateTime CreatedAt { get; set; } // Đã đổi thành DateTime

    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; } // Đã đổi thành DateTime?

    public string? UpdatedBy { get; set; }

    public virtual Category? Parent { get; set; }
    public ICollection<Category> Children { get; set; } = new List<Category>();

    public ICollection<ProductCategory> ProductCategories { get; set; } = new List<ProductCategory>();
}