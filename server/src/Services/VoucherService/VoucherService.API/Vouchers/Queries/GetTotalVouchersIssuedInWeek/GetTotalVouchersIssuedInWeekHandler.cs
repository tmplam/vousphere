using BuildingBlocks.CQRS;
using VoucherService.API.Dtos;

namespace VoucherService.API.Vouchers.Queries.GetTotalVouchersIssuedInWeek;

public record GetTotalVouchersIssuedInWeekQuery(DateTimeOffset CurrentDate) : IQuery<GetTotalVouchersIssuedInWeekResult>;
public record GetTotalVouchersIssuedInWeekResult(List<DayVoucherIssuedDto> WeekVouchersIssued);


public class GetBrandTotalVouchersIssuedInWeekHandler(
    IDocumentSession _session)
    : IQueryHandler<GetTotalVouchersIssuedInWeekQuery, GetTotalVouchersIssuedInWeekResult>
{
    public async Task<GetTotalVouchersIssuedInWeekResult> Handle(GetTotalVouchersIssuedInWeekQuery query, CancellationToken cancellationToken)
    {
        var startOfWeek = StartOfWeek(query.CurrentDate, DayOfWeek.Monday);
        var endOfWeek = startOfWeek.AddDays(7);

        var events = _session.Query<Voucher>();

        var groupedVouchers = new List<DayVoucherIssuedDto>();

        var currentDate = startOfWeek;
        var endDate = endOfWeek;

        while (currentDate < endDate)
        {
            groupedVouchers.Add(new DayVoucherIssuedDto
            {
                Date = currentDate,
                IssuedVouchers = (await events.ToListAsync()).Where(x => x.IssuedAt.Date == currentDate.Date).Count(),
            });
            currentDate = currentDate.AddDays(1);
        }

        return new GetTotalVouchersIssuedInWeekResult(groupedVouchers.OrderBy(dto => dto.Date).ToList());
    }

    private DateTimeOffset StartOfWeek(DateTimeOffset dt, DayOfWeek startOfWeek)
    {
        int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
        return dt.AddDays(-1 * diff).Date;
    }
}
