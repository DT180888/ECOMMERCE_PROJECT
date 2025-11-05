using ECommerce_API.Contracts.V1.Imgs.Requests;

namespace ECommerce_API.Contracts.V1.Products.Requests
{
    public sealed record CreateProductReq(
    string Name,
    string Slug,
    string? Description,
    byte Status,
    int? BrandId,
    List<CreateSkuReq> Skus,
    List<CreateImageReq> Images,
    List<int> CategoryIds,
    List<CreateAttributeReq> Attributes 
);
}
