using BuildingBlocks.Http.InternalServiceApis;

namespace NotificationService.API.Notifications.EventHandlers.IntegrationEventHandlers;

public class EventStartedIntegrationEventHandler(
    ILogger<EventStartedIntegrationEventHandler> _logger,
    IDocumentSession _session,
    IUserApi _userService,
    IHubContext<PlayerNotificationsHub, IPlayerNotificationsClient> _hubContext) 
    : IConsumer<EventStartedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<EventStartedIntegrationEvent> context)
    {
        _logger.LogInformation("Event started notification received.");

        var userIds = await _userService.GetFavoriteUserIdsAsync(context.Message.EventId);

        var tasks = Task.CompletedTask;
        if (userIds.Any())
        {
            foreach (var userId in userIds)
            {
                var notification = new Notification
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Type = NotificationType.EventStarted,
                    Title = "Event started",
                    Message = $"Event '{context.Message.EventName}' has started",
                    Data = new Dictionary<string, object>
                    {
                        { "eventId", context.Message.EventId },
                        { "eventName", context.Message.EventName }
                    }
                };
                _session.Store(notification);
                tasks = Task.WhenAll(tasks, _hubContext.Clients.User(userId.ToString()).ReceivePlayerNotification(notification));
            }
            
            await Task.WhenAll(_session.SaveChangesAsync(), tasks);
        }
    }
}
