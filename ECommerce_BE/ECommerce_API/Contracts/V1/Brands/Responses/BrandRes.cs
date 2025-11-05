namespace ECommerce_API.Contracts.V1.Brands.Responses
{
    public sealed record BrandRes(int BrandId, string Name, string Slug, DateTime CreatedAt);
}
