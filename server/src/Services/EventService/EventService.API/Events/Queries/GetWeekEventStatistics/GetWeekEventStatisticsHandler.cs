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
            .Where(x => x.StartTime >= startOfWeek && x.EndTime < endOfWeek)
            .ToListAsync(cancellationToken);

        var groupedEvents = events
            .GroupBy(e => e.StartTime.Date)
            .Select(g => new DayEventStatusDto
            {
                Date = g.Key,
                NumberOfPendings = g.Count(e => e.Status == EventStatus.Pending),
                NumberOfHappenings = g.Count(e => e.Status == EventStatus.Happening),
                NumberOfEndeds = g.Count(e => e.Status == EventStatus.Ended)
            })
            .ToList();

        // add the missing days
        var currentDate = startOfWeek;
        var endDate = endOfWeek;

        while (currentDate < endDate)
        {
            if (!groupedEvents.Any(e => e.Date == currentDate))
            {
                groupedEvents.Add(new DayEventStatusDto
                {
                    Date = currentDate,
                    NumberOfPendings = 0,
                    NumberOfHappenings = 0,
                    NumberOfEndeds = 0
                });
            }
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
