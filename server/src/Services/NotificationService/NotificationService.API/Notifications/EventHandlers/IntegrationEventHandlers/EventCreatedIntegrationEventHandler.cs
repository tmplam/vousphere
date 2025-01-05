using BuildingBlocks.Auth.Constants;

namespace NotificationService.API.Notifications.EventHandlers.IntegrationEventHandlers;

public class EventCreatedIntegrationEventHandler(
    ILogger<EventCreatedIntegrationEventHandler> _logger,
    IDocumentSession _session,
    IHubContext<AdminNotificationsHub, IAdminNotificationsClient> _hubContext)
    : IConsumer<EventCreatedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<EventCreatedIntegrationEvent> context)
    {
        _logger.LogInformation("New event created notification received.");

        var notification = new Notification
        {
            Type = NotificationType.EventCreated,
            Title = "New Event Created",
            Message = $"New event '{context.Message.EventName}' has been created.",
            Data = new
            {
                context.Message.EventId,
                context.Message.EventName,
                context.Message.BrandId,
                context.Message.BrandName
            }
        };

        _session.Store(notification);

        await Task.WhenAll(
            _session.SaveChangesAsync(),
            _hubContext.Clients.Group(AuthPolicy.Admin).ReceiveAdminNotification(
                notification.Type.ToString(),
                notification.Title,
                notification.Message,
                notification.CreatedAt,
                notification.Data));
    }
}
