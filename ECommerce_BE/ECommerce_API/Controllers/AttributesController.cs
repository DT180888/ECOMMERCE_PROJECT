using ECommerce_API.Contracts.V1.Attributes;
using ECommerce_API.Contracts.V1.Attributes.Requests;
using ECommerce_API.Contracts.V1.Attributes.Responses;
using ECommerce_Application.Attributes.Commands;
using ECommerce_Application.Attributes.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/v1/attributes")]
public class AttributesController(ISender mediator) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<AttributeListRes>> List([FromQuery] AttributeListQuery q, CancellationToken ct)
    {
        var (items, total) = await mediator.Send(new ListAttributesQuery(q.Keyword, q.Page, q.Size), ct);
        var res = new AttributeListRes(
            items.Select(d => new AttributeRes(d.AttributeId, d.Name, d.Slug, d.DataType, d.Unit, d.IsFilterable, d.IsVariant, d.CreatedAt)),
            q.Page, q.Size, total
        );
        return Ok(res);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<AttributeRes>> GetById([FromRoute] int id, CancellationToken ct)
    {
        var dto = await mediator.Send(new GetAttributeByIdQuery(id), ct);
        if (dto is null) return NotFound();
        return Ok(new AttributeRes(dto.AttributeId, dto.Name, dto.Slug, dto.DataType, dto.Unit, dto.IsFilterable, dto.IsVariant, dto.CreatedAt));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateAttributeReq req, CancellationToken ct)
    {
        var id = await mediator.Send(new CreateAttributeCommand(req.Name, req.Slug, req.DataType, req.Unit, req.IsFilterable, req.IsVariant), ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { attributeId = id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateAttributeReq req, CancellationToken ct)
    {
        await mediator.Send(new UpdateAttributeCommand(id, req.Name, req.Slug, req.DataType, req.Unit, req.IsFilterable, req.IsVariant), ct);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete([FromRoute] int id, CancellationToken ct)
    {
        await mediator.Send(new DeleteAttributeCommand(id), ct);
        return NoContent();
    }
}
