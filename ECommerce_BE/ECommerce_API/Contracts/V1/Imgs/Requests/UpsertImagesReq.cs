namespace ECommerce_API.Contracts.V1.Imgs.Requests
{
    public sealed record UpsertImagesReq(List<CreateImageReq> Images);
}
