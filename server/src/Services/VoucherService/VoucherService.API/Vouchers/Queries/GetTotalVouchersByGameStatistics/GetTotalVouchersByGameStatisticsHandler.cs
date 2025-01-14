using BuildingBlocks.CQRS;
using VoucherService.API.Dtos;

namespace VoucherService.API.Vouchers.Queries.GetTotalVouchersByGameStatistics;

public record GetTotalVouchersByGameStatisticsQuery : IQuery<GetTotalVouchersByGameStatisticsResult>;
public record GetTotalVouchersByGameStatisticsResult(List<GameReleasedVouchersDto> GameReleasedVouchers);

public class GetTotalVouchersByGameStatisticsHandler(
    IDocumentSession _session) : IQueryHandler<GetTotalVouchersByGameStatisticsQuery, GetTotalVouchersByGameStatisticsResult>
{
    public async Task<GetTotalVouchersByGameStatisticsResult> Handle(GetTotalVouchersByGameStatisticsQuery query, CancellationToken cancellationToken)
    {
        var vouchers = await _session.Query<Voucher>().ToListAsync(cancellationToken);

        var result = vouchers
            .GroupBy(x => x.GameId)
            .Select(x => new GameReleasedVouchersDto
            {
                GameId = x.Key,
                TotalReleasedVouchers = x.Count()
            })
            .ToList();

        return new GetTotalVouchersByGameStatisticsResult(result);
    }
}
