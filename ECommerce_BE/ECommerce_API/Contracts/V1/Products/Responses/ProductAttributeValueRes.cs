namespace ECommerce_API.Contracts.V1.Products.Responses
{
    public sealed record ProductAttributeValueRes(int AttributeId, string? ValueText, decimal? ValueNumber, bool? ValueBool);
}
