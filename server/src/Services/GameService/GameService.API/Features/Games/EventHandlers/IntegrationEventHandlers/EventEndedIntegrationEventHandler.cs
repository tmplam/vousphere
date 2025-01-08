using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;

namespace GameService.API.Features.Games.EventHandlers.IntegrationEventHandlers;

public class EventEndedIntegrationEventHandler : IConsumer<EventEndedIntegrationEvent>
{
    public Task Consume(ConsumeContext<EventEndedIntegrationEvent> context)
    {
        return Task.CompletedTask;
    }
}
