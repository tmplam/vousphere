using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;

namespace EventService.API.Events.EventHandlers.IntegrationEventHandlers;

public class VoucherCreatedIntegrationEventHandler(
    ILogger<VoucherCreatedIntegrationEventHandler> _logger,
    IDocumentSession _session)
    : IConsumer<VoucherCreatedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<VoucherCreatedIntegrationEvent> context)
    {
        var existingEvent = await _session.LoadAsync<Entities.Event>(context.Message.EventId);
        if (existingEvent == null)
        {
            _logger.LogError($"Event with id {context.Message.EventId} not found.");
            return;
        }

        var eventVoucher = existingEvent.VoucherTypes.FirstOrDefault(v => v.Id == context.Message.VoucherId);
        if (eventVoucher == null)
        {
            _logger.LogError($"Voucher with id {context.Message.VoucherId} not found in event with id {context.Message.EventId}.");
            return;
        }

        eventVoucher.Remaining--;
        _session.Update(existingEvent);

        await _session.SaveChangesAsync();
    }
}
