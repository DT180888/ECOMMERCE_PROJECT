using ECommerce_API.Contracts.V1.Products;
using ECommerce_API.Contracts.V1.Products.Requests;
using ECommerce_API.Contracts.V1.Products.Responses;
using ECommerce_API.Contracts.V1.Imgs.Requests;
using ECommerce_Application.Products.Commands;
using ECommerce_Application.Products.Queries;
using ECommerce_Domain.Entites;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ECommerce_Application.Common.Interfaces;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/v1/products")]
public class ProductsController(ISender mediator) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ProductListRes>> List([FromQuery] ProductListQuery q, CancellationToken ct)
    {
        var (items, total) = await mediator.Send(new ListProductsQuery(
            q.Keyword, q.BrandId, q.CategoryId, q.Status, q.PriceMin, q.PriceMax, q.Page, q.Size, q.Sort
        ), ct);

        var res = new ProductListRes(
            items.Select(d => new ProductCardRes(d.ProductId, d.Name, d.Slug, d.PrimaryImageUrl, d.MinPriceMinor, d.BrandId)),
            q.Page, q.Size, total
        );
        return Ok(res);
    }

    [HttpGet("{id:long}")]
    [AllowAnonymous]
    public async Task<ActionResult<ProductDetailRes>> GetById([FromRoute] long id, CancellationToken ct)
    {
        var dto = await mediator.Send(new GetProductDetailQuery(id), ct);
        if (dto is null) return NotFound();

        return Ok(new ProductDetailRes(
            dto.ProductId, dto.Name, dto.Slug, dto.Description, dto.Status, dto.BrandId,
            dto.Skus.Select(s => new SkuRes(s.SkuId, s.SkuCode, s.PriceMinor, s.IsActive)),
            dto.Images.Select(i => new ImageRes(i.ImageId, i.Url, i.IsPrimary, i.SortOrder)),
            dto.CategoryIds,
            dto.Attributes.Select(a => new ProductAttributeValueRes(a.AttributeId, a.ValueText, a.ValueNumber, a.ValueBool))
        ));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateProductReq req, CancellationToken ct)
    {
        var id = await mediator.Send(new CreateProductCommand(
             req.Name, req.Slug, req.Description, req.Status, req.BrandId,
             req.Skus.Select(s => new ProductSkuCreate(s.SkuCode, s.PriceMinor, s.IsActive)).ToList(),
             req.Images.Select(i => new ProductImageUpsert(i.Url, i.IsPrimary, i.SortOrder)).ToList(),
             req.CategoryIds,
             req.Attributes.Select(a => new ProductAttributeUpsert(a.AttributeId, a.ValueText, a.ValueNumber, a.ValueBool)).ToList()
         ), ct);

        return CreatedAtAction(nameof(GetById), new { id }, new { productId = id });
    }

    [HttpPut("{id:long}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update([FromRoute] long id, [FromBody] UpdateProductReq req, CancellationToken ct)
    {
        await mediator.Send(new UpdateProductCommand(
            id,
            req.Name, req.Slug, req.Description, req.Status, req.BrandId,
            req.Skus.Select(s => new ProductSkuUpdate(s.SkuId, s.SkuCode, s.PriceMinor, s.IsActive)).ToList(),
            req.Images.Select(i => new ProductImageUpsert(i.Url, i.IsPrimary, i.SortOrder)).ToList(),
            req.CategoryIds,
            req.Attributes.Select(a => new ProductAttributeUpsert(a.AttributeId, a.ValueText, a.ValueNumber, a.ValueBool)).ToList()
        ), ct);

        return NoContent();
    }

    [HttpDelete("{id:long}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete([FromRoute] long id, CancellationToken ct)
    {
        await mediator.Send(new DeleteProductCommand(id), ct);
        return NoContent();
    }

    [HttpPut("{id:long}/attributes")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpsertAttributes([FromRoute] long id, [FromBody] UpsertProductAttributesReq req, CancellationToken ct)
    {
        var items = (req.Attributes ?? new List<ProductAttributeItem>())
            .Select(a => new ProductAttributeUpsert(a.AttributeId, a.ValueText, a.ValueNumber, a.ValueBool))
            .ToList();

        await mediator.Send(new UpsertProductAttributesCommand(id, items), ct);
        return NoContent();
    }

    [HttpPut("{id:long}/images")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpsertImages([FromRoute] long id, [FromBody] UpsertImagesReq req, CancellationToken ct)
    {
        var imgs = req.Images
                      .Select((i, idx) => new ProductImageUpsert(
                          i.Url,
                          i.IsPrimary || idx == 0,                     // mặc định ảnh đầu là primary nếu FE không set
                          i.SortOrder > 0 ? i.SortOrder : idx + 1))    // mặc định sort theo vị trí
                      .ToList();

        await mediator.Send(new UpsertProductImagesCommand(id, imgs), ct);
        return NoContent();
    }
}