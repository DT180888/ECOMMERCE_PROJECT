namespace ECommerce_API.Contracts.V1.Categories.Requests
{
    public sealed record UpdateCategoryReq(string Name, string Slug, int? ParentId);
}
