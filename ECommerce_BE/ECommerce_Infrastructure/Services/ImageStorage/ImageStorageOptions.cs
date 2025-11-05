using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce_Infrastructure.Services.ImageStorage
{
    public sealed class ImageStorageOptions
    {
        // Thư mục gốc để lưu file (vd: "wwwroot/uploads")
        public string RootPath { get; init; } = "wwwroot/uploads";
        // Base URL public tương ứng (vd: "/uploads")
        public string BaseUrl { get; init; } = "/uploads";
        // Giới hạn kích thước (bytes) - ví dụ 10 MB
        public long MaxFileSizeBytes { get; init; } = 10 * 1024 * 1024;
        // Cho phép những mime types nào
        public string[] AllowedMimeTypes { get; init; } =
            new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
    }
}
