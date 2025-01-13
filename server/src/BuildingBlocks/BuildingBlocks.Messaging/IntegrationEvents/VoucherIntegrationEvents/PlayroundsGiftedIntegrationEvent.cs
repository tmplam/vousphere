namespace BuildingBlocks.Messaging.IntegrationEvents;

public class PlayroundsGiftedIntegrationEvent : IntegrationEvent
{
    public Guid SenderId { get; set; }
    public string SenderEmail { get; set; } = string.Empty;
    public Guid RecipientId { get; set; }
    public int NumberOfPlayrounds { get; set; }
}
