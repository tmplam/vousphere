using BuildingBlocks.Auth.Services;
using BuildingBlocks.CQRS;
using VoucherService.API.Dtos;

namespace VoucherService.API.Vouchers.Queries.GetBrandTotalVouchersByGameStatistics;

public record GetBrandTotalVouchersByGameStatisticsQuery : IQuery<GetBrandTotalVouchersByGameStatisticsResult>;
public record GetBrandTotalVouchersByGameStatisticsResult(List<GameReleasedVouchersDto> GameReleasedVouchers);

public class GetTotalVouchersByGameStatisticsHandler(
    IDocumentSession _session,
    IClaimService _claimService) : IQueryHandler<GetBrandTotalVouchersByGameStatisticsQuery, GetBrandTotalVouchersByGameStatisticsResult>
{
    public async Task<GetBrandTotalVouchersByGameStatisticsResult> Handle(GetBrandTotalVouchersByGameStatisticsQuery query, CancellationToken cancellationToken)
    {
        var brandId = Guid.Parse(_claimService.GetUserId());

        var vouchers = await _session.Query<Voucher>()
            .Where(x => x.BrandId == brandId)
            .ToListAsync(cancellationToken);

        var result = vouchers
            .GroupBy(x => x.GameId)
            .Select(x => new GameReleasedVouchersDto
            {
                GameId = x.Key,
                TotalReleasedVouchers = x.Count()
            })
            .ToList();

        return new GetBrandTotalVouchersByGameStatisticsResult(result);
    }
}
