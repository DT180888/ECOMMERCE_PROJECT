using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Brands.Queries
{
    public sealed record ListBrandsQuery(string? Keyword, int Page = 1, int Size = 20)
    : IRequest<(IEnumerable<BrandDto> Items, long Total)>;

    public sealed record BrandDto(int BrandId, string Name, string Slug, DateTime CreatedAt);
}
