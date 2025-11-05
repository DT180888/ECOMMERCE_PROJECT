using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Products.Queries
{
    public sealed record ListProductsQuery(
        string? Keyword, int? BrandId, int? CategoryId, byte? Status,
        long? PriceMin, long? PriceMax, int Page, int Size, string? Sort
    ) : IRequest<(IEnumerable<ProductCardDto> Items, long Total)>;

    public sealed record ProductCardDto(
        long ProductId, string Name, string Slug,
        string? PrimaryImageUrl, long? MinPriceMinor, int? BrandId
    );
}
