namespace ECommerce_API.Contracts.V1.Auth
{
    public sealed record ResetPasswordReq(string UserId, string Token, string NewPassword);
}
