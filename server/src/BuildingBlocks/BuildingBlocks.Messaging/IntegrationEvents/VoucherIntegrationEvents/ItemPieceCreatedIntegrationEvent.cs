namespace BuildingBlocks.Messaging.IntegrationEvents.VoucherIntegrationEvents;

public class ItemPieceCreatedIntegrationEvent : IntegrationEvent
{
    public Guid OwnerId { get; set; }
    public Guid EventId { get; set; }
    public Guid GameId { get; set; }
    public int PieceIndex { get; set; }
}
