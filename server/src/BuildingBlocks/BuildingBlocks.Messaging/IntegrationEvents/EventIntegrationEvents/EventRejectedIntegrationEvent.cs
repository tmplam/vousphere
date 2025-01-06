namespace BuildingBlocks.Messaging.IntegrationEvents;

public class EventRejectedIntegrationEvent : IntegrationEvent
{
    public Guid BrandId { get; set; }
    public Guid EventId { get; set; }
    public string EventName { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
}
