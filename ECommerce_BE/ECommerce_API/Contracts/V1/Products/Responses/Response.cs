namespace ECommerce_API.Contracts.V1.Products.Responses
{
    public sealed record ProductCardRes(
        long ProductId, string Name, string Slug,
        string? PrimaryImageUrl, long? MinPriceMinor, int? BrandId
    );
}
