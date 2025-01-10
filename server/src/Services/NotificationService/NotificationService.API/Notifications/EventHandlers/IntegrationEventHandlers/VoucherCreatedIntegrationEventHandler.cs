namespace NotificationService.API.Notifications.EventHandlers.IntegrationEventHandlers;


public class VoucherCreatedIntegrationEventHandler : IConsumer<VoucherCreatedIntegrationEvent>
{
    public Task Consume(ConsumeContext<VoucherCreatedIntegrationEvent> context)
    {
        return Task.CompletedTask;
    }
}
