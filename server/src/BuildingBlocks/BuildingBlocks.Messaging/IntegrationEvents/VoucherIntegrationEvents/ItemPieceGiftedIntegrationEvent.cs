namespace BuildingBlocks.Messaging.IntegrationEvents;

public class ItemPieceGiftedIntegrationEvent : IntegrationEvent
{
    public Guid SenderId { get; set; }
    public string SenderEmail { get; set; } = string.Empty;
    public Guid RecipientId { get; set; }
    public Guid BrandId { get; set; }
    public Guid EventId { get; set; }
    public int PieceIndex { get; set; }
    public int Quantity { get; set; }
}
