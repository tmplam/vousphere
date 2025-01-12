namespace NotificationService.API.Notifications.EventHandlers.IntegrationEventHandlers;

public class VoucherGiftedIntegrationEventHandler(
    ILogger<VoucherGiftedIntegrationEventHandler> _logger,
    IDocumentSession _session,
    IHubContext<PlayerNotificationsHub, IPlayerNotificationsClient> _hubContext) : IConsumer<VoucherGiftedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<VoucherGiftedIntegrationEvent> context)
    {
        _logger.LogInformation("Voucher gifted notification received.");


        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            UserId = context.Message.RecipientId,
            Type = NotificationType.VoucherGifted,
            Title = "Voucher gifted",
            Message = $"You have been gifted a {context.Message.Discount}% discount voucher",
            Data = new Dictionary<string, object>
            {
                { "senderId", context.Message.SenderId },
                { "senderEmail", context.Message.SenderEmail },
                { "eventId", context.Message.EventId },
                { "discount", context.Message.Discount },
            }
        };
        _session.Store(notification);

        await Task.WhenAll(
            _session.SaveChangesAsync(),
            _hubContext.Clients.User(context.Message.RecipientId.ToString()).ReceivePlayerNotification(notification));
    }
}
