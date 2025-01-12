namespace NotificationService.API.Notifications.EventHandlers.IntegrationEventHandlers;

public class ItemPieceGiftedIntegrationEventHandler(
    ILogger<ItemPieceGiftedIntegrationEventHandler> _logger,
    IDocumentSession _session,
    IHubContext<PlayerNotificationsHub, IPlayerNotificationsClient> _hubContext) : IConsumer<ItemPieceGiftedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<ItemPieceGiftedIntegrationEvent> context)
    {
        _logger.LogInformation("ItemPiece gifted notification received.");


        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            UserId = context.Message.RecipientId,
            Type = NotificationType.ItemGifted,
            Title = "Item piece gifted",
            Message = $"You have been gifted (an) item piece(s)",
            Data = new Dictionary<string, object>
            {
                { "senderId", context.Message.SenderId },
                { "senderEmail", context.Message.SenderEmail },
                { "eventId", context.Message.EventId },
                { "pieceIndex", context.Message.PieceIndex },
                { "quantity", context.Message.Quantity },
            }
        };
        _session.Store(notification);

        await Task.WhenAll(
            _session.SaveChangesAsync(),
            _hubContext.Clients.User(context.Message.RecipientId.ToString()).ReceivePlayerNotification(notification));
    }
}
