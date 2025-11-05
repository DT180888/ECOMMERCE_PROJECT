

namespace ECommerce_API.Contracts.V1.Attributes.Requests
{
    public sealed record CreateAttributeReq(
        string Name,
        string Slug,
        byte DataType,      // 0=Text,1=Number,2=Bool,3=Date,... tuỳ bạn
        string? Unit,
        bool IsFilterable,
        bool IsVariant
    );
}
