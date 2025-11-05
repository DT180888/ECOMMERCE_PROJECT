namespace ECommerce_API.Contracts.V1.Brands.Responses
{
    public sealed record BrandListRes(IEnumerable<BrandRes> Items, int Page, int Size, long Total);
}
