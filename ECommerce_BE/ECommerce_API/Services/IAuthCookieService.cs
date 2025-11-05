namespace ECommerce_API.Services
{
    public interface IAuthCookieService
    {
        void Issue(string tokenPlain, DateTime expiresUtc);
        string? Read();
        void Revoke();
    }
}
