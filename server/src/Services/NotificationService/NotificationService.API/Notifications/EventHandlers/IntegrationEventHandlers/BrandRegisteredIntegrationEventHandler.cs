using BuildingBlocks.Auth.Constants;

namespace NotificationService.API.Notifications.EventHandlers.IntegrationEventHandlers;


public class BrandRegisteredIntegrationEventHandler(
    ILogger<BrandRegisteredIntegrationEventHandler> _logger,
    IDocumentSession _session,
    IHubContext<AdminNotificationsHub, IAdminNotificationsClient> _hubContext) 
    : IConsumer<BrandRegisteredIntegrationEvent>
{
    public async Task Consume(ConsumeContext<BrandRegisteredIntegrationEvent> context)
    {
        _logger.LogInformation("New brand registered notification received.");

        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            Type = NotificationType.BrandRegistered,
            Title = "New brand registered",
            Message = $"New brand '{context.Message.BrandName}' registered",
            Data = new Dictionary<string, object>
            {
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
