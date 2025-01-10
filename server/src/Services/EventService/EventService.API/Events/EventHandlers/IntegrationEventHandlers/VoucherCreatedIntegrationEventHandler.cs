using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;

namespace EventService.API.Events.EventHandlers.IntegrationEventHandlers;

public class VoucherCreatedIntegrationEventHandler : IConsumer<VoucherCreatedIntegrationEvent>
{
    public Task Consume(ConsumeContext<VoucherCreatedIntegrationEvent> context)
    {
        return Task.CompletedTask;
    }
}
