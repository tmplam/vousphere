using BuildingBlocks.Auth.Services;
using BuildingBlocks.CQRS;
using BuildingBlocks.Exceptions;
using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;
using System.Security.Claims;
using VoucherService.API.Enums;

namespace VoucherService.API.Vouchers.Commands.GiftVoucher;

public record GiftVoucherCommand(Guid RecipientId, Guid VoucherId) : ICommand<GiftVoucherResult>;
public record GiftVoucherResult();

public class GiftVoucherCommandValidator : AbstractValidator<GiftVoucherCommand>
{
    public GiftVoucherCommandValidator()
    {
        RuleFor(x => x.RecipientId)
            .NotEmpty().WithMessage("User id is required");
        RuleFor(x => x.VoucherId)
            .NotEmpty().WithMessage("Voucher id is required");
    }
}


public class GiftVoucherHandler(
    IDocumentSession _session,
    IClaimService _claimService,
    IPublishEndpoint _publishEndpoint) : ICommandHandler<GiftVoucherCommand, GiftVoucherResult>
{
    public async Task<GiftVoucherResult> Handle(GiftVoucherCommand command, CancellationToken cancellationToken)
    {
        var senderId = Guid.Parse(_claimService.GetUserId());
        var senderEmail = _claimService.GetClaim(ClaimTypes.Email)!;

        var voucher = await _session.LoadAsync<Voucher>(command.VoucherId, cancellationToken);

        if (voucher == null || voucher.OwnerId != senderId || voucher.Status == VoucherStatus.Redeemed)
            throw new NotFoundException("Voucher not found");

        voucher.OwnerId = command.RecipientId;
        _session.Update(voucher);

        var voucherGiftedMessage = new VoucherGiftedIntegrationEvent
        {
            VoucherId = voucher.Id,
            SenderId = senderId,
            SenderEmail = senderEmail,
            RecipientId = command.RecipientId,
            EventId = voucher.EventId,
            BrandId = voucher.BrandId,
            Discount = voucher.Discount,
        };

        await Task.WhenAll(
            _session.SaveChangesAsync(cancellationToken),
            _publishEndpoint.Publish(voucherGiftedMessage, cancellationToken)
        );

        return new GiftVoucherResult();
    }
}
