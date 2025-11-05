namespace ECommerce_API.Contracts.V1.Auth
{
    public sealed record ChangePasswordReq(string CurrentPassword, string NewPassword);
}
