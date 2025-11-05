

namespace ECommerce_API.Contracts.V1.Attributes.Responses
{
    public sealed record AttributeRes(
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
