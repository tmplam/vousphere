using BuildingBlocks.Auth.Services;
using BuildingBlocks.CQRS;
using VoucherService.API.Enums;

namespace VoucherService.API.Vouchers.Queries.GetBrandTotalRedeemedVouchers;

public record GetBrandTotalRedeemedVouchersQuery() : IQuery<GetBrandTotalRedeemedVouchersResult>;
public record GetBrandTotalRedeemedVouchersResult(long TotalRedeemedVouchers);


public class GetBrandTotalRedeemedVouchersHandler(
    IDocumentSession _session,
    IClaimService _claimService)
    : IQueryHandler<GetBrandTotalRedeemedVouchersQuery, GetBrandTotalRedeemedVouchersResult>
{
    public async Task<GetBrandTotalRedeemedVouchersResult> Handle(GetBrandTotalRedeemedVouchersQuery query, CancellationToken cancellationToken)
    {
        var brandId = Guid.Parse(_claimService.GetUserId());

        var totalRedeemedVouchers = await _session.Query<Voucher>()
            .Where(v => v.BrandId == brandId && v.Status == VoucherStatus.Redeemed)
            .CountAsync();

        return new GetBrandTotalRedeemedVouchersResult(totalRedeemedVouchers);
    }
}
