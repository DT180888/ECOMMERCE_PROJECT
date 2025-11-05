namespace ECommerce_API.Contracts.V1.Auth
{
    public sealed record ConfirmEmailAndSetPasswordReq(string UserId, string Token, string NewPassword);
}
