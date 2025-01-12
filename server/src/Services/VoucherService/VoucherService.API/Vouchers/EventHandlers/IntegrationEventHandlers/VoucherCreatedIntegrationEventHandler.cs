using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;
using VoucherService.API.Enums;
using VoucherService.API.Services;

namespace VoucherService.API.Vouchers.EventHandlers.IntegrationEventHandlers;

public class VoucherCreatedIntegrationEventHandler(
    IDocumentSession _session,
    IVoucherUtility _voucherUtility) : IConsumer<VoucherCreatedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<VoucherCreatedIntegrationEvent> context)
    {
        var code = _voucherUtility.GenerateVoucherCode();

        while (await _session.Query<Voucher>().AnyAsync(x =>
            x.BrandId == context.Message.BrandId &&
            x.Code == code && 
            x.Status == VoucherStatus.Active))
        {
            code = _voucherUtility.GenerateVoucherCode();
        }

        var voucher = new Voucher
        {
            Id = Guid.NewGuid(),
            BrandId = context.Message.BrandId,
            EventId = context.Message.EventId,
            OwnerId = context.Message.OwnerId,
            GameId = context.Message.GameId,
            Code = code,
            Discount = context.Message.Discount,
            IssuedAt = context.Message.IssuedAt,
            ExpiredAt = context.Message.IssuedAt.AddDays(30)
        };

        _session.Store(voucher);
        await _session.SaveChangesAsync();
    }
}
