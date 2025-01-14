using BuildingBlocks.Auth.Services;
using BuildingBlocks.CQRS;
using VoucherService.API.Dtos;

namespace VoucherService.API.Vouchers.Queries.GetBrandTotalVouchersIssuedInWeek;

public record GetBrandTotalVouchersIssuedInWeekQuery(DateTimeOffset CurrentDate) : IQuery<GetBrandTotalVouchersIssuedInWeekResult>;
public record GetBrandTotalVouchersIssuedInWeekResult(List<DayVoucherIssuedDto> WeekVouchersIssued);


public class GetBrandTotalVouchersIssuedInWeekHandler(
    IDocumentSession _session,
    IClaimService _claimService)
    : IQueryHandler<GetBrandTotalVouchersIssuedInWeekQuery, GetBrandTotalVouchersIssuedInWeekResult>
{
    public async Task<GetBrandTotalVouchersIssuedInWeekResult> Handle(GetBrandTotalVouchersIssuedInWeekQuery query, CancellationToken cancellationToken)
    {
        var brandId = Guid.Parse(_claimService.GetUserId());

        var startOfWeek = StartOfWeek(query.CurrentDate, DayOfWeek.Monday);
        var endOfWeek = startOfWeek.AddDays(7);

        var events = _session.Query<Voucher>().Where(v => v.BrandId == brandId);

        var groupedVouchers = new List<DayVoucherIssuedDto>();

        var currentDate = startOfWeek;
        var endDate = endOfWeek;

        while (currentDate < endDate)
        {
            groupedVouchers.Add(new DayVoucherIssuedDto
            {
                Date = currentDate,
                IssuedVouchers = await events.Where(x => x.IssuedAt.Date == currentDate.Date).CountAsync(),
            });
            currentDate = currentDate.AddDays(1);
        }

        return new GetBrandTotalVouchersIssuedInWeekResult(groupedVouchers.OrderBy(dto => dto.Date).ToList());
    }

    private DateTimeOffset StartOfWeek(DateTimeOffset dt, DayOfWeek startOfWeek)
    {
        int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
        return dt.AddDays(-1 * diff).Date;
    }
}
