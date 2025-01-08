using BuildingBlocks.Messaging.IntegrationEvents;
using GameService.API.Utilities;
using MassTransit;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace GameService.API.Features.Games.EventHandlers.IntegrationEventHandlers;

public class EventStartedIntegrationEventHandler(
    ILogger<EventStartedIntegrationEventHandler> _logger,
    IDistributedCache _cache,
    IEventApi _eventService) : IConsumer<EventStartedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<EventStartedIntegrationEvent> context)
    {
        var internalEventInfo = await _eventService.GetInternalEventInfoAsync(context.Message.EventId);

        if (internalEventInfo == null)
        {
            _logger.LogError("Event with id {EventId} not found", context.Message.EventId);
            return;
        }

        await _cache.SetStringAsync(RedisCacheKeys.EventInfoKey(context.Message.EventId), JsonSerializer.Serialize(internalEventInfo));
    }
}
