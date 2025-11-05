namespace ECommerce_API.Contracts.V1.Products.Responses
{
    public sealed record ProductListRes(IEnumerable<ProductCardRes> Items, int Page, int Size, long Total);
}
