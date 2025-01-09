using BuildingBlocks.Messaging.IntegrationEvents;
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
        await _cache.RemoveAsync($"Event:{context.Message.EventId}");
    }
}
