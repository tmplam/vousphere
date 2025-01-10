namespace BuildingBlocks.Messaging.IntegrationEvents;

public class VoucherCreatedIntegrationEvent : IntegrationEvent
{
    public Guid VoucherId { get; set; }
    public Guid OwnerId { get; set; }
    public Guid EventId { get; set; }
    public Guid GameId { get; set; }
    public double Discount { get; set; }
    public string Code { get; set; } = string.Empty;
    public DateTimeOffset IssuedAt { get; set; }
}
