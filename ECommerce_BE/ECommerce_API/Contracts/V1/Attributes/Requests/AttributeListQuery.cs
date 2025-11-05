namespace ECommerce_API.Contracts.V1.Attributes.Requests
{
    public sealed record AttributeListQuery(string? Keyword = null, int Page = 1, int Size = 20);
}
