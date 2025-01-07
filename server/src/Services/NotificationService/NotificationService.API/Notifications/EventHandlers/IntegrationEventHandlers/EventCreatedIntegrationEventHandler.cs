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
            Id = Guid.NewGuid(),
            Type = NotificationType.EventCreated,
            Title = "New event created",
            Message = $"Brand '{context.Message.BrandName}' created event '{context.Message.EventName}'",
            Data = new Dictionary<string, object>
            {
                { "eventId", context.Message.EventId },
                { "eventName", context.Message.EventName },
                { "brandId", context.Message.BrandId },
                { "brandName", context.Message.BrandName }
            }
        };

        _session.Store(notification);

        await Task.WhenAll(
            _session.SaveChangesAsync(),
            _hubContext.Clients.Group(AuthPolicy.Admin).ReceiveAdminNotification(notification));
    }
}
