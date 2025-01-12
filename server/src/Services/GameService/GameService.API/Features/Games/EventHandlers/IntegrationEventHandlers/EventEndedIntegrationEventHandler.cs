using BuildingBlocks.Messaging.IntegrationEvents;
using GameService.API.Utilities;
using MassTransit;
using Microsoft.Extensions.Caching.Distributed;

namespace GameService.API.Features.Games.EventHandlers.IntegrationEventHandlers;

public class EventEndedIntegrationEventHandler(
    ILogger<EventStartedIntegrationEventHandler> _logger,
    IDistributedCache _cache,
    IEventApi _eventService) : IConsumer<EventEndedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<EventEndedIntegrationEvent> context)
    {
        _logger.LogInformation("Event with id {EventId} ended", context.Message.EventId);

        await _cache.RemoveAsync(RedisCacheKeys.EventInfoKey(context.Message.EventId));
    }
}
