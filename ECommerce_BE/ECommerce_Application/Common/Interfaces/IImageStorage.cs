using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ECommerce_Application.Common.Interfaces
{
    public sealed record ImageStoredResult(
    string Url,            // URL public cho FE dùng
    string Path,           // Đường dẫn vật lý/tương đối trong storage
    string ContentType,
    long SizeBytes
);

    public interface IImageStorage
    {
        // Lưu 1 ảnh, folder ví dụ: "products/123"
        Task<ImageStoredResult> SaveAsync(IFormFile file, string folder, CancellationToken ct = default);

        // Xoá theo path đã trả về ở SaveAsync
        Task DeleteAsync(string path, CancellationToken ct = default);

        // Tạo URL public (nếu cần) từ path
        string GetPublicUrl(string path);

        Task<ImageStoredResult> MoveAsync(string path, string toFolder, CancellationToken ct = default);
    }
}
