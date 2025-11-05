namespace ECommerce_API.Contracts.V1.Brands.Requests
{
    public sealed record BrandListQuery(string? Keyword = null, int Page = 1, int Size = 20);
}
