namespace BuildingBlocks.Messaging.IntegrationEvents;

public class UserPlayedGameIntegrationEvent : IntegrationEvent
{
    public Guid UserId { get; set; }
    public Guid EventId { get; set; }
    public string GameId { get; set; } = string.Empty;
    public DateTimeOffset PlayedAt { get; set; }
}
