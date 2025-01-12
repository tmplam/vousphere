using BuildingBlocks.Auth.Services;
using BuildingBlocks.CQRS;
using BuildingBlocks.Exceptions;
using BuildingBlocks.Http.InternalServiceApis;
using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;

namespace VoucherService.API.Vouchers.Commands.ConvertItemPiecesToVoucher;

public record ConvertItemPiecesToVoucherCommand(Guid EventId) : ICommand<ConvertItemPiecesToVoucherResult>;
public record ConvertItemPiecesToVoucherResult(double? Discount = 0);


public class ConvertItemPiecesToVoucherCommandValidator : AbstractValidator<ConvertItemPiecesToVoucherCommand>
{
    public ConvertItemPiecesToVoucherCommandValidator()
    {
        RuleFor(x => x.EventId)
            .NotEmpty().WithMessage("Event id is required");
    }
}


public class ConvertItemPiecesToVoucherHandler(
    IDocumentSession _session,
    IEventApi _eventService,
    IClaimService _claimService,
    IPublishEndpoint _publishEndpoint) : ICommandHandler<ConvertItemPiecesToVoucherCommand, ConvertItemPiecesToVoucherResult>
{
    public async Task<ConvertItemPiecesToVoucherResult> Handle(ConvertItemPiecesToVoucherCommand command, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_claimService.GetUserId());

        var eventInfo = await _eventService.GetInternalEventInfoAsync(command.EventId);

        if (eventInfo == null || eventInfo.Item == null)
            throw new NotFoundException("Event or event item info not found");

        var itemPieces = await _session.Query<ItemPiece>()
            .Where(i => i.OwnerId == userId && i.EventId == command.EventId)
            .ToListAsync();

        if (itemPieces.Count() < eventInfo.Item.NumberPieces)
            throw new BadRequestException("Not enough item pieces");

        var voucherTypes = eventInfo.VoucherTypes.Where(v => v.Remaining > 0);

        if (!voucherTypes.Any())
            throw new BadRequestException("No vouchers available");

        // random voucher type
        var voucher = voucherTypes.ElementAt(new Random().Next(voucherTypes.Count()));

        // minus each piece by one
        foreach (var itemPiece in itemPieces)
        {
            itemPiece.Count--;
            if (itemPiece.Count == 0)
                _session.Delete(itemPiece);
            else
                _session.Update(itemPiece);
        }

        // send voucher created
        var voucherCreatedMessage = new VoucherCreatedIntegrationEvent
        {
            VoucherId = voucher.Id,
            OwnerId = userId,
            BrandId = eventInfo.BrandId,
            EventId = command.EventId,
            GameId = string.Empty,
            Discount = voucher.Discount,
            IssuedAt = DateTimeOffset.UtcNow
        };

        await Task.WhenAll(
            _publishEndpoint.Publish(voucherCreatedMessage),
            _session.SaveChangesAsync(cancellationToken));

        return new ConvertItemPiecesToVoucherResult(voucher.Discount);
    }
}
