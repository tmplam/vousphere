using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace UserService.Application.Features.Users.EventHandlers.IntegrationEventHandlers;

public class EventStartedIntegrationEventHandler(
    ILogger<EventStartedIntegrationEventHandler> _logger,
    IUserFavoriteRepository _userFavoriteRepository) : IConsumer<EventStartedIntegrationEvent>
{
    public Task Consume(ConsumeContext<EventStartedIntegrationEvent> context)
    {
        throw new NotImplementedException();
    }
}
