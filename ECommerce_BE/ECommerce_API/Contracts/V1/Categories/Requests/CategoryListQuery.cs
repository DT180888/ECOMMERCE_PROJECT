namespace ECommerce_API.Contracts.V1.Categories.Requests
{
    public sealed record CategoryListQuery(string? Keyword = null, int Page = 1, int Size = 20);
}
