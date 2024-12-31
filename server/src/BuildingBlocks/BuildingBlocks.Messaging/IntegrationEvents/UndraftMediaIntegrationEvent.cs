namespace BuildingBlocks.Messaging.IntegrationEvents;

public class UndraftMediaIntegrationEvent : IntegrationEvent
{
    public Guid MediaId { get; set; }
}
