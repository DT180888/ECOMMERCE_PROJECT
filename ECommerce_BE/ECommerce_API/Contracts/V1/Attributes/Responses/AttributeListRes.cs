namespace ECommerce_API.Contracts.V1.Attributes.Responses
{
    public sealed record AttributeListRes(IEnumerable<AttributeRes> Items, int Page, int Size, long Total);
}
