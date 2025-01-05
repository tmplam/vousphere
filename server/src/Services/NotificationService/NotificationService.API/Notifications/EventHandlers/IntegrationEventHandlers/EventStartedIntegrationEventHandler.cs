namespace NotificationService.API.Notifications.EventHandlers.IntegrationEventHandlers;

public class EventStartedIntegrationEventHandler(
    ILogger<EventStartedIntegrationEventHandler> _logger) 
    : IConsumer<EventStartedIntegrationEvent>
{
    public Task Consume(ConsumeContext<EventStartedIntegrationEvent> context)
    {
        return Task.CompletedTask;
    }
}
