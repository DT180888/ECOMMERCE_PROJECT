namespace ECommerce_API.Contracts.V1.Categories.Responses
{
    public sealed record CategoryNodeRes(
        int CategoryId, string Name, string Slug, int? ParentId,
        IEnumerable<CategoryNodeRes> Children
    );
}
