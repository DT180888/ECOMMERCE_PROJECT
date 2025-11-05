namespace ECommerce_API.Contracts.V1.Imgs.Requests
{
    public sealed record CreateImageReq(string Url, bool IsPrimary = false, int SortOrder = 0);
    
}
