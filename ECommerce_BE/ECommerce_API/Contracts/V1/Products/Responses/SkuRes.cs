namespace ECommerce_API.Contracts.V1.Products.Responses
{
    public sealed record SkuRes(long SkuId, string SkuCode, long PriceMinor, bool IsActive);
}
