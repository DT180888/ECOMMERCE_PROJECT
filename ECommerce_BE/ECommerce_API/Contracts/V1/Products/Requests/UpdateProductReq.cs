using ECommerce_API.Contracts.V1.Imgs.Requests;

namespace ECommerce_API.Contracts.V1.Products.Requests
{
    public sealed record UpdateProductReq(
    string Name,
    string Slug,
    string? Description,
    byte Status,
    int? BrandId,
    List<UpdateSkuReq> Skus,          // có Id nếu update
    List<CreateImageReq> Images,      // đơn giản: replace toàn bộ bộ ảnh
    List<int> CategoryIds,            // replace toàn bộ liên kết category
    List<CreateAttributeReq> Attributes
);
}
