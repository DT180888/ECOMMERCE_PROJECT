namespace ECommerce_API.Contracts.V1.Products.Requests
{
    public sealed record CreateAttributeReq(int AttributeId, string? ValueText, decimal? ValueNumber, bool? ValueBool);
}
