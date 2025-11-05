namespace ECommerce_API.Contracts.V1.Categories.Responses
{
    public sealed record BreadcrumbRes(IEnumerable<BreadcrumbItemRes> Items);
}
