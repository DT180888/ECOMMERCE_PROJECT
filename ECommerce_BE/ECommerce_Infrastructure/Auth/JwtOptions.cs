

namespace ECommerce_Infrastructure.Auth
{
    public sealed class JwtOptions
    {
        public string Issuer { get; init; } = null!;
        public string Audience { get; init; } = null!;
        public string Key { get; init; } = null!;
        public int ExpireMinutes { get; init; } = 60;
        public int RefreshExpireDays { get; init; } = 7;
    }
}
