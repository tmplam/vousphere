using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;

namespace GameService.API.Features.Games.EventHandlers.IntegrationEventHandlers;

public class EventStartedIntegrationEventHandler(
    IEventApi _eventService) : IConsumer<EventStartedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<EventStartedIntegrationEvent> context)
    {
        var internalEventInfo = await _eventService.GetInternalEventInfoAsync(context.Message.EventId);
    }
}
