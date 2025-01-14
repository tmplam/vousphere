namespace EventService.API.Events.Queries.GetWeekEventStatistics;

public record GetWeekEventStatisticsQuery(DateTimeOffset CurrentDate) : IQuery<GetWeekEventStatisticsResult>;
public record GetWeekEventStatisticsResult(List<DayEventStatusDto> WeekEventStatus);


public class GetWeekEventStatisticsHandler(
    IDocumentSession _session)
    : IQueryHandler<GetWeekEventStatisticsQuery, GetWeekEventStatisticsResult>
{
    public async Task<GetWeekEventStatisticsResult> Handle(GetWeekEventStatisticsQuery query, CancellationToken cancellationToken)
    {
        var startOfWeek = StartOfWeek(query.CurrentDate, DayOfWeek.Monday);
        var endOfWeek = startOfWeek.AddDays(7);

        var events = await _session.Query<Event>()
            .Where(x => x.Status != EventStatus.Created && x.Status != EventStatus.Rejected)
            .ToListAsync(cancellationToken);

        var groupedEvents = new List<DayEventStatusDto>();

        var currentDate = startOfWeek;
        var endDate = endOfWeek;

        while (currentDate < endDate)
        {
            groupedEvents.Add(new DayEventStatusDto
            {
                Date = currentDate,
                NumberOfPendings = events.Where(x => x.StartTime > currentDate).Count(),
                NumberOfHappenings = events.Where(x => x.EndTime >currentDate && x.StartTime <= currentDate ).Count(),
                NumberOfEndeds = events.Where(x => x.EndTime <= currentDate).Count(),
            });
            currentDate = currentDate.AddDays(1);
        }

        return new GetWeekEventStatisticsResult(groupedEvents.OrderBy(dto => dto.Date).ToList());
    }

    private DateTimeOffset StartOfWeek(DateTimeOffset dt, DayOfWeek startOfWeek)
    {
        int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
        return dt.AddDays(-1 * diff).Date;
    }
}
