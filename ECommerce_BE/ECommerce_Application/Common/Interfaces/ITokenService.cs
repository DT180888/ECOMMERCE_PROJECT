using System.Security.Claims;

namespace ECommerce_Application.Common.Interfaces;

public interface ITokenService
{
    string CreateAccessToken(string userId, string? email, IEnumerable<string> roles, IEnumerable<Claim>? extra = null);
    (string tokenPlain, string tokenHash, DateTime expires) CreateRefreshToken();
    string ComputeHash(string input);
}
