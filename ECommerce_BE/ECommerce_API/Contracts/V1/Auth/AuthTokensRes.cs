namespace ECommerce_API.Contracts.V1.Auth
{
    public sealed record AuthTokensRes(string AccessToken, string TokenType, int ExpiresIn);
}
