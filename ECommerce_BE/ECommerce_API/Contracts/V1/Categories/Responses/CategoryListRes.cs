namespace ECommerce_API.Contracts.V1.Categories.Responses
{
    public sealed record CategoryListRes(IEnumerable<CategoryRes> Items, int Page, int Size, long Total);
}
