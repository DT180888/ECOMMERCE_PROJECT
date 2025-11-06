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
    [RequestSizeLimit(15_000_000)] // giới hạn 15 MB
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<List<UploadTempRes>>> UploadTemp([FromForm] List<IFormFile> files, CancellationToken ct)
    {
        if (files is null || files.Count == 0)
            return BadRequest("No files provided.");

        var results = new List<UploadTempRes>();

        foreach (var file in files)
        {
            var folder = $"tmp/{DateTime.UtcNow:yyyyMMdd}";
            var res = await storage.SaveAsync(file, folder, ct);
            results.Add(new UploadTempRes(res.Url, res.Path, res.ContentType, res.SizeBytes));
        }

        return Ok(results);  // Trả về danh sách ảnh đã upload
    }
}
