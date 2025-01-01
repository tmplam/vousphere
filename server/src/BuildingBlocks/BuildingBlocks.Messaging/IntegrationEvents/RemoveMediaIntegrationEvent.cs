namespace BuildingBlocks.Messaging.IntegrationEvents;

public class RemoveMediaIntegrationEvent : IntegrationEvent
{
    public Guid MediaId { get; set; }
}
