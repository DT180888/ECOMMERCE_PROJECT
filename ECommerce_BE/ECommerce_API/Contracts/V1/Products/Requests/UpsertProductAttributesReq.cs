

namespace ECommerce_API.Contracts.V1.Products.Requests
{
    public sealed record ProductAttributeItem(int AttributeId, string? ValueText, decimal? ValueNumber, bool? ValueBool);
    public sealed record UpsertProductAttributesReq
    {
        public List<ProductAttributeItem> Attributes { get; init; } = new(); // non-null
    }
}
