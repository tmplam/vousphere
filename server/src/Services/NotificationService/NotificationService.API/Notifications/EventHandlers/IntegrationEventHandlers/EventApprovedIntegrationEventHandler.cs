namespace NotificationService.API.Notifications.EventHandlers.IntegrationEventHandlers;

public class EventApprovedIntegrationEventHandler(
    ILogger<EventApprovedIntegrationEventHandler> _logger,
    IDocumentSession _session,
    IHubContext<BrandNotificationsHub, IBrandNotificationsClient> _hubContext)
    : IConsumer<EventApprovedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<EventApprovedIntegrationEvent> context)
    {
        _logger.LogInformation("Event approved notification received.");

        var notification = new Notification
        {
            UserId = context.Message.BrandId,
            Type = NotificationType.EventApproved,
            Title = "Your event was approved",
            Message = $"Your event '{context.Message.EventName}' was approved by admin",
            Data = new
            {
                context.Message.BrandId,
                context.Message.EventId,
                context.Message.EventName,
            }
        };

        _session.Store(notification);

        await Task.WhenAll(
            _session.SaveChangesAsync(),
            _hubContext.Clients.User(context.Message.BrandId.ToString()).ReceiveBrandNotification(notification));
    }
}
