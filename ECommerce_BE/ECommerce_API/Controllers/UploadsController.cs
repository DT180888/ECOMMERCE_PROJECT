// ECommerce_API/Controllers/UploadsController.cs
using ECommerce_API.Contracts.V1.Imgs.Requests;
using ECommerce_API.Contracts.V1.Imgs.Responses;
using ECommerce_Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce_API.Controllers;

[ApiController]
[Route("api/v1/uploads")]
public class UploadsController(IImageStorage storage) : ControllerBase
{
    [HttpPost("tmp")]
    [Authorize(Roles = "Admin")]
    [RequestSizeLimit(15_000_000)]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(UploadTempRes), StatusCodes.Status200OK)]
    public async Task<ActionResult<UploadTempRes>> UploadTemp([FromForm] UploadTempReq req, CancellationToken ct)
    {
        if (req.File is null || req.File.Length == 0) return BadRequest("No file provided.");
        var folder = $"tmp/{DateTime.UtcNow:yyyyMMdd}";
        var res = await storage.SaveAsync(req.File, folder, ct);
        return Ok(new UploadTempRes(res.Url, res.Path, res.ContentType, res.SizeBytes));
    }
}
