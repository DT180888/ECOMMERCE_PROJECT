using ECommerce_Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Attributes.Queries
{
    public sealed record ListAttributesQuery(string? Keyword, int Page = 1, int Size = 20)
    : IRequest<(IEnumerable<AttributeDto> Items, long Total)>;

    public sealed record AttributeDto(
        int AttributeId,
        string Name,
        string Slug,
        byte DataType,
        string? Unit,
        bool IsFilterable,
        bool IsVariant,
        DateTime CreatedAt
    );
}
