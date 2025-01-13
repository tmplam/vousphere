using BuildingBlocks.Auth.Services;
using BuildingBlocks.CQRS;
using BuildingBlocks.Exceptions;
using VoucherService.API.Enums;

namespace VoucherService.API.Vouchers.Commands.RedeemVoucher;

public record RedeemVoucherCommand(Guid VoucherId) : ICommand<RedeemVoucherResult>;
public record RedeemVoucherResult();


public class RedeemVoucherHandler(
    IDocumentSession _session,
    IClaimService _claimService) : ICommandHandler<RedeemVoucherCommand, RedeemVoucherResult>
{
    public async Task<RedeemVoucherResult> Handle(RedeemVoucherCommand command, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_claimService.GetUserId());

        var voucher = await _session.Query<Voucher>()
            .Where(v => v.Id == command.VoucherId && v.OwnerId == userId)
            .FirstOrDefaultAsync();

        if (voucher is null)
            throw new NotFoundException("Voucher not found");

        if (voucher.Status == VoucherStatus.Redeemed)
            throw new BadRequestException("Voucher already redeemed");

        if (voucher.ExpiredAt < DateTimeOffset.UtcNow)
            throw new BadRequestException("Voucher expired");

        voucher.Status = VoucherStatus.Redeemed;

        _session.Update(voucher);

        return new RedeemVoucherResult();
    }
}