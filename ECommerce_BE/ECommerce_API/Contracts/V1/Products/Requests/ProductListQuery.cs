namespace ECommerce_API.Contracts.V1.Products.Requests
{
    public sealed record ProductListQuery(
        string? Keyword = null,
        int? BrandId = null,
        int? CategoryId = null,
        byte? Status = null,
        long? PriceMin = null,      // đơn vị: minor (VD: VND)
        long? PriceMax = null,
        int Page = 1,
        int Size = 20,
        string? Sort = null         // "created_desc|created_asc|price_asc|price_desc|name_asc|name_desc"
    );
}
