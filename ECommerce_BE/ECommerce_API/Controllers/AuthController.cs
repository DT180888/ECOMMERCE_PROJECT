// ECommerce_API/Controllers/AuthController.cs
using ECommerce_API.Contracts.V1.Auth;
using ECommerce_API.Services;
using ECommerce_Application.Common.Interfaces;          // ⬅️ interface từ Application
using ECommerce_Domain.Entites;
using ECommerce_Infrastructure.Auth;                   // JwtOptions
using ECommerce_Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace ECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _users;
    private readonly RoleManager<IdentityRole> _roles;
    private readonly ITokenService _tokens;        // từ Application
    private readonly AppDbContext _db;
    private readonly JwtOptions _jwt;
    private readonly IAuthCookieService _cookies;  // ⬅️ service cookie

    public AuthController(UserManager<IdentityUser> users,
                          RoleManager<IdentityRole> roles,
                          ITokenService tokens,
                          AppDbContext db,
                          IOptions<JwtOptions> jwt,
                          IAuthCookieService cookies)
    { _users = users; _roles = roles; _tokens = tokens; _db = db; _jwt = jwt.Value; _cookies = cookies; }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterReq req)
    {
        // tạo user chưa có password
        var user = new IdentityUser { UserName = req.Email, Email = req.Email, EmailConfirmed = false };
        var result = await _users.CreateAsync(user); // ← KHÔNG truyền password
        if (!result.Succeeded) return BadRequest(result.Errors);

        // gửi token xác thực (dev mode trả về)
        var token = await _users.GenerateEmailConfirmationTokenAsync(user);
        return Ok(new { userId = user.Id, confirmToken = token });
    }

    [HttpPost("confirm-email-set-password")]
    public async Task<IActionResult> ConfirmEmailAndSetPassword([FromBody] ConfirmEmailAndSetPasswordReq req)
    {
        var user = await _users.FindByIdAsync(req.UserId);
        if (user is null) return NotFound();

        // 1) Xác thực email (idempotent)
        if (!user.EmailConfirmed)
        {
            var confirmRes = await _users.ConfirmEmailAsync(user, req.Token);
            if (!confirmRes.Succeeded) return BadRequest(confirmRes.Errors);
        }

        // 2) Đặt mật khẩu lần đầu (chỉ cho phép nếu chưa từng có password)
        if (user.PasswordHash is not null)
            return BadRequest(new { error = "Password already set. Use /change-password or /reset-password." });

        var addPwd = await _users.AddPasswordAsync(user, req.NewPassword);
        if (!addPwd.Succeeded) return BadRequest(addPwd.Errors);

        // 3) Sau khi xác thực & có password → gán role Customer
        const string defaultRole = "Customer";
        if (!await _roles.RoleExistsAsync(defaultRole))
            await _roles.CreateAsync(new IdentityRole(defaultRole));
        if (!await _users.IsInRoleAsync(user, defaultRole))
            await _users.AddToRoleAsync(user, defaultRole);

        // 4) (Tuỳ chọn) Đăng nhập luôn: cấp access token + refresh cookie
        var roles = await _users.GetRolesAsync(user);
        var access = _tokens.CreateAccessToken(user.Id, user.Email, roles);

        var (plain, hash, exp) = _tokens.CreateRefreshToken();
        _db.RefreshTokens.Add(new RefreshToken
        {
            TokenHash = hash,
            ExpiresAt = exp,
            CreatedAt = DateTime.UtcNow,
            CreatedByIp = HttpContext.Connection.RemoteIpAddress?.ToString(),
            UserId = user.Id
        });
        await _db.SaveChangesAsync();
        _cookies.Issue(plain, exp);

        return Ok(new { access_token = access, token_type = "Bearer", expires_in = _jwt.ExpireMinutes * 60 });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginReq req)
    {
        var user = await _users.FindByEmailAsync(req.Email);
        if (user is null) return Unauthorized();
        if (!user.EmailConfirmed) return Forbid("Email not confirmed.");
        if (user.PasswordHash is null) return Forbid("Password not set. Please confirm email and set password.");
        if (!await _users.CheckPasswordAsync(user, req.Password)) return Unauthorized();

        var roles = await _users.GetRolesAsync(user);
        var access = _tokens.CreateAccessToken(user.Id, user.Email, roles);

        var (plain, hash, exp) = _tokens.CreateRefreshToken();
        _db.RefreshTokens.Add(new RefreshToken
        {
            TokenHash = hash,
            ExpiresAt = exp,
            CreatedAt = DateTime.UtcNow,
            CreatedByIp = HttpContext.Connection.RemoteIpAddress?.ToString(),
            UserId = user.Id
        });
        await _db.SaveChangesAsync();
        _cookies.Issue(plain, exp);

        return Ok(new { access_token = access, token_type = "Bearer", expires_in = _jwt.ExpireMinutes * 60 });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var plain = _cookies.Read();    // ⬅️ đọc cookie
        if (string.IsNullOrEmpty(plain)) return Unauthorized();

        var hash = _tokens.ComputeHash(plain);
        var rt = await _db.RefreshTokens.AsNoTracking().FirstOrDefaultAsync(x => x.TokenHash == hash);
        if (rt is null || !rt.IsActive) return Unauthorized();

        var user = await _users.FindByIdAsync(rt.UserId);
        if (user is null) return Unauthorized();

        // rotate
        var (newPlain, newHash, exp) = _tokens.CreateRefreshToken();
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();

        // revoke old
        var old = await _db.RefreshTokens.FirstOrDefaultAsync(x => x.TokenHash == hash);
        if (old is not null)
        {
            old.RevokedAt = DateTime.UtcNow;
            old.RevokedByIp = ip;
            old.ReplacedByTokenHash = newHash;
        }

        _db.RefreshTokens.Add(new RefreshToken
        {
            TokenHash = newHash,
            ExpiresAt = exp,
            CreatedAt = DateTime.UtcNow,
            CreatedByIp = ip,
            UserId = user.Id
        });
        await _db.SaveChangesAsync();

        _cookies.Issue(newPlain, exp);  // ⬅️ ghi cookie mới

        var roles = await _users.GetRolesAsync(user);
        var access = _tokens.CreateAccessToken(user.Id, user.Email, roles);
        return Ok(new { access_token = access, token_type = "Bearer", expires_in = _jwt.ExpireMinutes * 60 });
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var plain = _cookies.Read();
        if (!string.IsNullOrEmpty(plain))
        {
            var hash = _tokens.ComputeHash(plain);
            var rt = await _db.RefreshTokens.FirstOrDefaultAsync(x => x.TokenHash == hash);
            if (rt is not null)
            {
                rt.RevokedAt = DateTime.UtcNow;
                rt.RevokedByIp = HttpContext.Connection.RemoteIpAddress?.ToString();
                await _db.SaveChangesAsync();
            }
        }
        _cookies.Revoke();
        return Ok();
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordReq req)
    {
        var user = await _users.FindByEmailAsync(req.Email);
        if (user is null) return Ok();
        if (!user.EmailConfirmed) return Forbid("Email not confirmed."); // tuỳ policy
        var token = await _users.GeneratePasswordResetTokenAsync(user);
        return Ok(new { userId = user.Id, resetToken = token });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordReq req)
    {
        var user = await _users.FindByIdAsync(req.UserId);
        if (user is null) return NotFound();
        var res = await _users.ResetPasswordAsync(user, req.Token, req.NewPassword);
        return res.Succeeded ? Ok() : BadRequest(res.Errors);
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordReq req)
    {
        var user = await _users.GetUserAsync(User);
        var res = await _users.ChangePasswordAsync(user!, req.CurrentPassword, req.NewPassword);
        return res.Succeeded ? Ok() : BadRequest(res.Errors);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var user = await _users.GetUserAsync(User);
        var roles = await _users.GetRolesAsync(user!);
        return Ok(new { user!.Id, user.Email, roles });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("assign-role")]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleReq req)
    {
        var user = await _users.FindByEmailAsync(req.Email);
        if (user is null) return NotFound();
        if (!await _roles.RoleExistsAsync(req.Role)) await _roles.CreateAsync(new IdentityRole(req.Role));
        var res = await _users.AddToRoleAsync(user, req.Role);
        return res.Succeeded ? Ok() : BadRequest(res.Errors);
    }
}
