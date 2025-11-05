using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Application.Products.Commands
{
    public sealed record ProductSkuCreate(string SkuCode, long PriceMinor, bool IsActive);

    // Dùng khi cập nhật SKU (có thể thêm mới nếu SkuId = null)
    public sealed record ProductSkuUpdate(long? SkuId, string SkuCode, long PriceMinor, bool IsActive);

    // Ảnh sản phẩm (dùng chung cho create/update - policy: replace toàn bộ list)
    public sealed record ProductImageUpsert(string Url, bool IsPrimary, int SortOrder);

    // Thuộc tính sản phẩm (dùng chung cho create/update - policy: replace toàn bộ list)
    public sealed record ProductAttributeUpsert(int AttributeId, string? ValueText, decimal? ValueNumber, bool? ValueBool);

    public sealed record UpsertProductImagesCommand(long ProductId, List<ProductImageUpsert> Images) : IRequest;

    public sealed record UpsertProductAttributesCommand(long ProductId,List<ProductAttributeUpsert> Attributes) : IRequest;
}
