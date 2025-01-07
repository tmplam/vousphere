namespace BuildingBlocks.Messaging.IntegrationEvents;

public class EventStartedIntegrationEvent : IntegrationEvent
{
    public Guid EventId { get; set; }
    public string EventName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid ImageId { get; set; }
    public string? Image { get; set; }
    public Guid BrandId { get; set; }
}
