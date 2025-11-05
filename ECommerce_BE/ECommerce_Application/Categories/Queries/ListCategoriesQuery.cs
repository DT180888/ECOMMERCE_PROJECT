using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Categories.Queries
{
    public sealed record ListCategoriesQuery(string? Keyword, int Page = 1, int Size = 20)
        : IRequest<(IEnumerable<CategoryDto> Items, long Total)>;

    public sealed record CategoryDto(int CategoryId, string Name, string Slug, int? ParentId, DateTime CreatedAt);
}
