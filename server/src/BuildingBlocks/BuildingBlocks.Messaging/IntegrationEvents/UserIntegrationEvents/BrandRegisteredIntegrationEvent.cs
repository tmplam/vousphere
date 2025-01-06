namespace BuildingBlocks.Messaging.IntegrationEvents;

public class BrandRegisteredIntegrationEvent : IntegrationEvent
{
    public Guid BrandId { get; set; }
    public string BrandName { get; set; } = string.Empty;
}
