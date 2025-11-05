using ECommerce_API.Contracts.V1.Attributes.Responses;

namespace ECommerce_API.Contracts.V1.Products.Responses
{
    public sealed record ProductDetailRes(
        long ProductId, string Name, string Slug, string? Description, byte Status, int? BrandId,
        IEnumerable<SkuRes> Skus, IEnumerable<ImageRes> Images, IEnumerable<int> CategoryIds, IEnumerable<ProductAttributeValueRes> Attributes
    );
}
