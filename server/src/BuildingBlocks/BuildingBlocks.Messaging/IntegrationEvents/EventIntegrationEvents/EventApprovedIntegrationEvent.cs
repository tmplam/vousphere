namespace BuildingBlocks.Messaging.IntegrationEvents;

public class EventApprovedIntegrationEvent : IntegrationEvent
{
    public Guid BrandId { get; set; }
    public Guid EventId { get; set; }
    public string EventName { get; set; } = string.Empty;
}
