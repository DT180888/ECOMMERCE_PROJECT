using ECommerce_API.Services;
using Microsoft.AspNetCore.Http;

namespace ECommerce_API.Services;

public sealed class AuthCookieService(IHttpContextAccessor accessor) : IAuthCookieService
{
    private const string Name = "refresh_token";

    public void Issue(string tokenPlain, DateTime expiresUtc)
    {
        var ctx = accessor.HttpContext!;
        ctx.Response.Cookies.Append(Name, tokenPlain, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None, // nếu test localhost gặp vấn đề có thể đổi Lax
            Expires = expiresUtc
        });
    }

    public string? Read()
    {
        accessor.HttpContext!.Request.Cookies.TryGetValue(Name, out var v);
        return v;
    }

    public void Revoke() => accessor.HttpContext!.Response.Cookies.Delete(Name);
}