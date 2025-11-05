using ECommerce_API.Contracts.V1.Categories;
using ECommerce_API.Contracts.V1.Categories.Requests;
using ECommerce_API.Contracts.V1.Categories.Responses;
using ECommerce_Application.Categories.Commands;
using ECommerce_Application.Categories.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/v1/categories")]
public class CategoriesController(ISender mediator) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<CategoryListRes>> List([FromQuery] CategoryListQuery q, CancellationToken ct)
    {
        var (items, total) = await mediator.Send(new ListCategoriesQuery(q.Keyword, q.Page, q.Size), ct);
        var res = new CategoryListRes(
            items.Select(d => new CategoryRes(d.CategoryId, d.Name, d.Slug, d.ParentId, d.CreatedAt)),
            q.Page, q.Size, total);
        return Ok(res);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<CategoryRes>> GetById([FromRoute] int id, CancellationToken ct)
    {
        var dto = await mediator.Send(new GetCategoryByIdQuery(id), ct);
        if (dto is null) return NotFound();
        return Ok(new CategoryRes(dto.CategoryId, dto.Name, dto.Slug, dto.ParentId, dto.CreatedAt));
    }

    [HttpGet("tree")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<CategoryNodeRes>>> GetTree(CancellationToken ct)
    {
        var roots = await mediator.Send(new GetCategoryTreeQuery(), ct);
        IEnumerable<CategoryNodeRes> Map(IEnumerable<CategoryNodeDto> nodes)
            => nodes.Select(n => new CategoryNodeRes(n.CategoryId, n.Name, n.Slug, n.ParentId, Map(n.Children)));
        return Ok(Map(roots));
    }

    [HttpGet("{id:int}/breadcrumb")]
    [AllowAnonymous]
    public async Task<ActionResult<BreadcrumbRes>> Breadcrumb([FromRoute] int id, CancellationToken ct)
    {
        var items = await mediator.Send(new GetCategoryBreadcrumbQuery(id), ct);
        return Ok(new BreadcrumbRes(items.Select(i => new BreadcrumbItemRes(i.CategoryId, i.Name, i.Slug))));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateCategoryReq req, CancellationToken ct)
    {
        var id = await mediator.Send(new CreateCategoryCommand(req.Name, req.Slug, req.ParentId), ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { categoryId = id });
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateCategoryReq req, CancellationToken ct)
    {
        await mediator.Send(new UpdateCategoryCommand(id, req.Name, req.Slug, req.ParentId), ct);
        return NoContent();
    }

    [HttpPost("{id:int}/move")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Move([FromRoute] int id, [FromBody] MoveCategoryReq req, CancellationToken ct)
    {
        await mediator.Send(new MoveCategoryCommand(id, req.NewParentId), ct);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete([FromRoute] int id, CancellationToken ct)
    {
        await mediator.Send(new DeleteCategoryCommand(id), ct);
        return NoContent();
    }
}
