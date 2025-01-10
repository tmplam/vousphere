using MassTransit;

namespace VoucherService.API.Vouchers.EventHandlers.IntegrationEventHandlers;

public class VoucherCreatedIntegrationEventHandler : IConsumer<VoucherCreatedIntegrationEventHandler>
{
    public Task Consume(ConsumeContext<VoucherCreatedIntegrationEventHandler> context)
    {
        return Task.CompletedTask;
    }
}
