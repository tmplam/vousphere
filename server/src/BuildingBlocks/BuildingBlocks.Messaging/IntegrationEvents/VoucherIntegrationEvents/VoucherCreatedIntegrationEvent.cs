namespace BuildingBlocks.Messaging.IntegrationEvents;

public class VoucherCreatedIntegrationEvent : IntegrationEvent
{
    public Guid VoucherId { get; set; }
    public Guid OwnerId { get; set; }
    public Guid BrandId { get; set; }
    public Guid EventId { get; set; }
    public string GameId { get; set; } = string.Empty;
    public double Discount { get; set; }
    public DateTimeOffset IssuedAt { get; set; }
}
