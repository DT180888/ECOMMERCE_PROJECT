using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using ECommerce_Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace ECommerce_Infrastructure.Services.ImageStorage
{
    public sealed class LocalImageStorage : IImageStorage
    {
        private readonly ImageStorageOptions _opt;

        public LocalImageStorage(IOptions<ImageStorageOptions> opt)
        {
            _opt = opt.Value;
            Directory.CreateDirectory(_opt.RootPath);
        }

        public async Task<ImageStoredResult> SaveAsync(IFormFile file, string folder, CancellationToken ct = default)
        {
            // 1) Validate kích thước
            if (file.Length == 0) throw new InvalidOperationException("Empty file.");
            if (file.Length > _opt.MaxFileSizeBytes)
                throw new InvalidOperationException($"File too large. Limit: {_opt.MaxFileSizeBytes} bytes.");

            // 2) Validate content-type + magic bytes
            var contentType = file.ContentType?.ToLowerInvariant() ?? "";
            if (!_opt.AllowedMimeTypes.Contains(contentType))
                throw new InvalidOperationException($"Unsupported content type: {contentType}");

            using var ms = new MemoryStream();
            await file.CopyToAsync(ms, ct);
            var bytes = ms.ToArray();
            ValidateMagicBytes(bytes, contentType);

            // 3) Đặt tên file an toàn
            var ext = GetExtensionByContentType(contentType); // .jpg/.png/.webp/.gif
            var safeFolder = SanitizeFolder(folder);          // vd: "products/123"
            var dir = Path.Combine(_opt.RootPath, safeFolder);
            Directory.CreateDirectory(dir);

            var unique = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}_{RandomNumberGenerator.GetInt32(1000, 9999)}";
            var fileName = $"{unique}{ext}";
            var savePath = Path.Combine(dir, fileName);

            await File.WriteAllBytesAsync(savePath, bytes, ct);

            var relPath = $"{safeFolder}/{fileName}".Replace('\\', '/'); // path tương đối từ BaseUrl
            var url = $"{_opt.BaseUrl.TrimEnd('/')}/{relPath}".Replace('\\', '/');

            return new ImageStoredResult(url, relPath, contentType, bytes.LongLength);
        }

        public Task DeleteAsync(string path, CancellationToken ct = default)
        {
            var physical = Path.Combine(_opt.RootPath, path);
            if (File.Exists(physical)) File.Delete(physical);
            return Task.CompletedTask;
        }

        public string GetPublicUrl(string path)
            => $"{_opt.BaseUrl.TrimEnd('/')}/{path}".Replace('\\', '/');

        private static string SanitizeFolder(string folder)
        {
            folder = folder.Replace('\\', '/').Trim().Trim('/');
            // chỉ cho phép a-z0-9-/_
            folder = Regex.Replace(folder.ToLowerInvariant(), @"[^a-z0-9/_\-]", "");
            return folder;
        }

        private static string GetExtensionByContentType(string contentType)
            => contentType switch
            {
                "image/jpeg" => ".jpg",
                "image/png" => ".png",
                "image/webp" => ".webp",
                "image/gif" => ".gif",
                _ => ".bin"
            };

        private static void ValidateMagicBytes(byte[] bytes, string contentType)
        {
            // Rất gọn: check vài header phổ biến
            bool ok = contentType switch
            {
                "image/jpeg" => bytes.Length > 3 && bytes[0] == 0xFF && bytes[1] == 0xD8,
                "image/png" => bytes.Length > 8 && bytes[0] == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47,
                "image/webp" => bytes.Length > 12 && bytes[0] == 0x52 && bytes[1] == 0x49 && bytes[2] == 0x46 && bytes[3] == 0x46, // "RIFF"
                "image/gif" => bytes.Length > 6 && bytes[0] == 0x47 && bytes[1] == 0x49 && bytes[2] == 0x46, // "GIF"
                _ => false
            };
            if (!ok) throw new InvalidOperationException("Invalid file signature.");
        }

        public Task<ImageStoredResult> MoveAsync(string path, string toFolder, CancellationToken ct = default)
        {
            var src = Path.Combine(_opt.RootPath, path);
            if (!File.Exists(src))
                throw new FileNotFoundException("Source not found.", src);

            var safeFolder = SanitizeFolder(toFolder);
            var dir = Path.Combine(_opt.RootPath, safeFolder);
            Directory.CreateDirectory(dir);

            var fileName = Path.GetFileName(src);
            var dst = Path.Combine(dir, fileName);

            // nếu trùng tên, thêm hậu tố
            if (File.Exists(dst))
            {
                var name = Path.GetFileNameWithoutExtension(fileName);
                var ext = Path.GetExtension(fileName);
                dst = Path.Combine(dir, $"{name}_{RandomNumberGenerator.GetInt32(1000, 9999)}{ext}");
            }

            File.Move(src, dst);

            var relPath = $"{safeFolder}/{Path.GetFileName(dst)}".Replace('\\', '/');
            var url = $"{_opt.BaseUrl.TrimEnd('/')}/{relPath}".Replace('\\', '/');
            var contentType = GetContentTypeFromExt(Path.GetExtension(dst).ToLowerInvariant());
            var info = new FileInfo(dst);

            // ✅ Trả về Task hoàn thành
            return Task.FromResult(new ImageStoredResult(url, relPath, contentType, info.Length));
        }

        private static string GetContentTypeFromExt(string ext) => ext switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".webp" => "image/webp",
            ".gif" => "image/gif",
            _ => "application/octet-stream"
        };
    }
}
