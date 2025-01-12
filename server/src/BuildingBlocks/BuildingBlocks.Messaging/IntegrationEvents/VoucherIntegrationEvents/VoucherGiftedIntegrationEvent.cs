namespace BuildingBlocks.Messaging.IntegrationEvents;

public class VoucherGiftedIntegrationEvent : IntegrationEvent
{
    public Guid VoucherId { get; set; }
    public Guid SenderId { get; set; }
    public string SenderEmail { get; set; } = string.Empty;
    public Guid RecipientId { get; set; }
    public Guid BrandId { get; set; }
    public Guid EventId { get; set; }
    public double Discount { get; set; }
}
