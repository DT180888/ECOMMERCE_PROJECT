namespace ECommerce_API.Contracts.V1.Auth
{
    public sealed record ConfirmEmailReq(string UserId, string Token);
}
