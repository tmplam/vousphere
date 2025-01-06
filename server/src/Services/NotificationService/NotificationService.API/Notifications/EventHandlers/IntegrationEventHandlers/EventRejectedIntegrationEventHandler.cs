namespace NotificationService.API.Notifications.EventHandlers.IntegrationEventHandlers;

public class EventRejectedIntegrationEventHandler(
    ILogger<EventRejectedIntegrationEventHandler> _logger,
    IDocumentSession _session,
    IHubContext<BrandNotificationsHub, IBrandNotificationsClient> _hubContext)
    : IConsumer<EventRejectedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<EventRejectedIntegrationEvent> context)
    {
        _logger.LogInformation("Event rejected notification received.");

        var notification = new Notification
        {
            UserId = context.Message.BrandId,
            Type = NotificationType.EventRejected,
            Title = "Your event was rejected",
            Message = $"Your event '{context.Message.EventName}' was rejected by admin",
            Data = new Dictionary<string, object>
            {
                { "brandId", context.Message.BrandId },
                { "eventId", context.Message.EventId },
                { "eventName", context.Message.EventName },
                { "comment", context.Message.Comment }
            }
        };

        _session.Store(notification);

        await Task.WhenAll(
            _session.SaveChangesAsync(),
            _hubContext.Clients.User(context.Message.BrandId.ToString()).ReceiveBrandNotification(notification));
    }
}
