using System;

namespace ECommerce_Domain.Entites
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string TokenHash { get; set; } = default!;
        public DateTime ExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CreatedByIp { get; set; }
        public DateTime? RevokedAt { get; set; }
        public string? RevokedByIp { get; set; }
        public string? ReplacedByTokenHash { get; set; }

        // FK tới AspNetUsers (dbo.AspNetUsers) — giữ ở dạng string, KHÔNG tham chiếu IdentityUser trong Domain
        public string UserId { get; set; } = default!;

        // convenience
        public bool IsActive => RevokedAt == null && DateTime.UtcNow <= ExpiresAt;
    }
}
