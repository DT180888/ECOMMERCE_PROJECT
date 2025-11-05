namespace ECommerce_API.Contracts.V1.Categories.Requests
{
    public sealed record CreateCategoryReq(string Name, string Slug, int? ParentId);
}
