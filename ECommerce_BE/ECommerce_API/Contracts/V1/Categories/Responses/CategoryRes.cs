namespace ECommerce_API.Contracts.V1.Categories.Responses
{
    public sealed record CategoryRes(int CategoryId, string Name, string Slug, int? ParentId, DateTime CreatedAt);
}
