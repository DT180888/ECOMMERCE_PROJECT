namespace ECommerce_API.Contracts.V1.Imgs.Responses
{
    public sealed record UploadTempRes(string Url, string Path, string ContentType, long SizeBytes);
}
