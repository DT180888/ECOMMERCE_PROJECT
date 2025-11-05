using ECommerce_API.Contracts.V1.Brands;
using ECommerce_API.Contracts.V1.Brands.Requests;
using ECommerce_API.Contracts.V1.Brands.Responses;
using ECommerce_Application.Brands.Commands;
using ECommerce_Application.Brands.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/v1/brands")]
public class BrandsController(ISender mediator) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<BrandListRes>> List([FromQuery] BrandListQuery q, CancellationToken ct)
    {
        var (items, total) = await mediator.Send(new ListBrandsQuery(q.Keyword, q.Page, q.Size), ct);
        var res = new BrandListRes(
            items.Select(d => new BrandRes(d.BrandId, d.Name, d.Slug, d.CreatedAt)),
            q.Page, q.Size, total);
        return Ok(res);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<BrandRes>> GetById([FromRoute] int id, CancellationToken ct)
    {
        var dto = await mediator.Send(new GetBrandByIdQuery(id), ct);
        if (dto is null) return NotFound();
        return Ok(new BrandRes(dto.BrandId, dto.Name, dto.Slug, dto.CreatedAt));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateBrandReq req, CancellationToken ct)
    {
        var id = await mediator.Send(new CreateBrandCommand(req.Name, req.Slug), ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { brandId = id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateBrandReq req, CancellationToken ct)
    {
        await mediator.Send(new UpdateBrandCommand(id, req.Name, req.Slug), ct);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete([FromRoute] int id, CancellationToken ct)
    {
        await mediator.Send(new DeleteBrandCommand(id), ct);
        return NoContent();
    }
}
