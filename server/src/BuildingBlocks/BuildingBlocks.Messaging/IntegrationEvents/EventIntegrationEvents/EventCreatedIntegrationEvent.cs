namespace BuildingBlocks.Messaging.IntegrationEvents;

public class EventCreatedIntegrationEvent : IntegrationEvent
{
    public Guid EventId { get; set; }
    public string EventName { get; set; } = string.Empty;
    public Guid BrandId { get; set; }
    public string BrandName { get; set; } = string.Empty;
}
