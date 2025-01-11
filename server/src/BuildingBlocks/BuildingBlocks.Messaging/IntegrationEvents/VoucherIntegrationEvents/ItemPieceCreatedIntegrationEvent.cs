namespace BuildingBlocks.Messaging.IntegrationEvents;

public class ItemPieceCreatedIntegrationEvent : IntegrationEvent
{
    public Guid OwnerId { get; set; }
    public Guid EventId { get; set; }
    public Guid BrandId { get; set; }
    public string GameId { get; set; } = string.Empty;
    public int PieceIndex { get; set; }
}
