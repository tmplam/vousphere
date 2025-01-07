namespace BuildingBlocks.Messaging.IntegrationEvents;

public class EventEndedIntegrationEvent : IntegrationEvent
{
    public Guid EventId { get; set; }
}
