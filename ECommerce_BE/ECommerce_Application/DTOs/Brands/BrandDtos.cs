using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.DTOs.Brands
{
    public record BrandDto(int BrandId, string Name, string Slug, bool IsDeleted, DateTime CreatedAt, string? CreatedBy, DateTime? UpdatedAt, string? UpdatedBy);
    public record BrandCreateDto(string Name, string Slug);
    public record BrandUpdateDto(string Name, string Slug, byte[] RowVersion);


    public record PagedResult<T>(IReadOnlyList<T> Items, int Page, int PageSize, int TotalItems)
    {
        public int TotalPages => (int)Math.Ceiling((double)TotalItems / PageSize);
    }
}
