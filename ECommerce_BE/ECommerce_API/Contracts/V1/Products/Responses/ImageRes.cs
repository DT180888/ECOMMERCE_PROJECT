namespace ECommerce_API.Contracts.V1.Products.Responses
{
    public sealed record ImageRes(long ImageId, string Url, bool IsPrimary, int SortOrder);
}
