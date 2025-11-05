namespace ECommerce_API.Contracts.V1.Products.Requests
{
    public sealed record UpdateSkuReq(long? SkuId, string SkuCode, long PriceMinor, bool IsActive);
}
