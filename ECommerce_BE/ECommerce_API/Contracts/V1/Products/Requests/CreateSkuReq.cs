namespace ECommerce_API.Contracts.V1.Products.Requests
{
    public sealed record CreateSkuReq(string SkuCode, long PriceMinor, bool IsActive);

}
