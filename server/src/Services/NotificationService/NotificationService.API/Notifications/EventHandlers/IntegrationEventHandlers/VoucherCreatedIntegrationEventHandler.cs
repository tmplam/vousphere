namespace NotificationService.API.Notifications.EventHandlers.IntegrationEventHandlers;


public class VoucherCreatedIntegrationEventHandler(
    ILogger<VoucherCreatedIntegrationEventHandler> _logger,
    IDocumentSession _session,
    IHubContext<PlayerNotificationsHub, IPlayerNotificationsClient> _hubContext) 
    : IConsumer<VoucherCreatedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<VoucherCreatedIntegrationEvent> context)
    {
        _logger.LogInformation("Voucher received notification received.");


        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            UserId = context.Message.OwnerId,
            Type = NotificationType.VoucherReceived,
            Title = "Voucher received",
            Message = $"You have received a {context.Message.Discount}% discount",
            Data = new Dictionary<string, object>
                {
                    { "eventId", context.Message.EventId },
                    { "discount", context.Message.Discount },
                }
        };
        _session.Store(notification);

        await Task.WhenAll(
            _session.SaveChangesAsync(),
            _hubContext.Clients.User(context.Message.OwnerId.ToString()).ReceivePlayerNotification(notification));
    }
}
