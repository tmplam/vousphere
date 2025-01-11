namespace NotificationService.API.Notifications.EventHandlers.IntegrationEventHandlers;

public class ItemPieceCreatedIntegrationEventHandler(
    ILogger<ItemPieceCreatedIntegrationEventHandler> _logger,
    IDocumentSession _session,
    IHubContext<PlayerNotificationsHub, IPlayerNotificationsClient> _hubContext) : IConsumer<ItemPieceCreatedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<ItemPieceCreatedIntegrationEvent> context)
    {
        _logger.LogInformation("Item received notification received.");

        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            UserId = context.Message.OwnerId,
            Type = NotificationType.ItemPieceReceived,
            Title = "Item piece received",
            Message = $"You have received an item piece",
            Data = new Dictionary<string, object>
            {
                { "eventId", context.Message.EventId },
                { "pieceIndex", context.Message.PieceIndex },
            }
        };
        _session.Store(notification);

        await Task.WhenAll(
            _session.SaveChangesAsync(),
            _hubContext.Clients.User(context.Message.OwnerId.ToString()).ReceivePlayerNotification(notification));
    }
}
