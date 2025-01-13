namespace NotificationService.API.Notifications.EventHandlers.IntegrationEventHandlers;

public class PlayroundsGiftedIntegrationEventHandler(
    ILogger<PlayroundsGiftedIntegrationEventHandler> _logger,
    IDocumentSession _session,
    IHubContext<PlayerNotificationsHub, IPlayerNotificationsClient> _hubContext) : IConsumer<PlayroundsGiftedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<PlayroundsGiftedIntegrationEvent> context)
    {
        _logger.LogInformation("Play rounds gifted notification received.");

        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            UserId = context.Message.RecipientId,
            Type = NotificationType.VoucherReceived,
            Title = "Play rounds gifted",
            Message = $"You have received {context.Message.NumberOfPlayrounds} playrounds from {context.Message.SenderEmail}",
            Data = new Dictionary<string, object>
            {
                { "numberOfPlayrounds", context.Message.NumberOfPlayrounds },
            }
        };

        _session.Store(notification);

        await Task.WhenAll(
            _session.SaveChangesAsync(),
            _hubContext.Clients.User(context.Message.RecipientId.ToString()).ReceivePlayerNotification(notification));
    }
}
