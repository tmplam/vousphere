namespace EventService.API.Events.Queries.GetBrandWeekEventStatistics;

public record GetBrandWeekEventStatisticsQuery(DateTimeOffset CurrentDate) : IQuery<GetBrandWeekEventStatisticsResult>;
public record GetBrandWeekEventStatisticsResult(List<DayEventStatusDto> WeekEventStatus);


public class GetBrandWeekEventStatisticsHandler(
    IDocumentSession _session,
    IClaimService _claimService)
    : IQueryHandler<GetBrandWeekEventStatisticsQuery, GetBrandWeekEventStatisticsResult>
{
    public async Task<GetBrandWeekEventStatisticsResult> Handle(GetBrandWeekEventStatisticsQuery query, CancellationToken cancellationToken)
    {
        var brandId = Guid.Parse(_claimService.GetUserId());

        var startOfWeek = StartOfWeek(query.CurrentDate, DayOfWeek.Monday);
        var endOfWeek = startOfWeek.AddDays(7);

        var events = await _session.Query<Event>()
            .Where(x => x.BrandId == brandId && x.Status != EventStatus.Created && x.Status != EventStatus.Rejected)
            .ToListAsync(cancellationToken);

        var groupedEvents = new List<DayEventStatusDto>();

        var currentDate = startOfWeek;
        var endDate = endOfWeek;

        while (currentDate < endDate)
        {
            groupedEvents.Add(new DayEventStatusDto
            {
                Date = currentDate,
                NumberOfPendings = events.Where(x => x.StartTime.Date > currentDate).Count(),
                NumberOfHappenings = events.Where(x => x.EndTime.Date > currentDate && x.StartTime.Date <= currentDate).Count(),
                NumberOfEndeds = events.Where(x => x.EndTime.Date == currentDate).Count(),
            });
            currentDate = currentDate.AddDays(1);
        }

        return new GetBrandWeekEventStatisticsResult(groupedEvents.OrderBy(dto => dto.Date).ToList());
    }

    private DateTimeOffset StartOfWeek(DateTimeOffset dt, DayOfWeek startOfWeek)
    {
        int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
        return dt.AddDays(-1 * diff).Date;
    }
}
