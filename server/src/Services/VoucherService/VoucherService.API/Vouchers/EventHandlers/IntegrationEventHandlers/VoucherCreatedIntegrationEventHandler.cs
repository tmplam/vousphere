using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;
using VoucherService.API.Services;

namespace VoucherService.API.Vouchers.EventHandlers.IntegrationEventHandlers;

public class VoucherCreatedIntegrationEventHandler(
    IDocumentSession _session,
    IVoucherUtility _voucherUtility) : IConsumer<VoucherCreatedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<VoucherCreatedIntegrationEvent> context)
    {
        var voucher = new Voucher
        {
            Id = Guid.NewGuid(),
            EventId = context.Message.EventId,
            OwnerId = context.Message.OwnerId,
            GameId = context.Message.GameId,
            Code = _voucherUtility.GenerateVoucherCode(),
            Discount = context.Message.Discount,
            IssuedAt = context.Message.IssuedAt,
            ExpiredAt = context.Message.IssuedAt.AddDays(30)
        };

        _session.Store(voucher);
        await _session.SaveChangesAsync();
    }
}
