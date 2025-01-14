using System.Security.Cryptography.Xml;

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
            .Where(x => x.BrandId == brandId && x.StartTime >= startOfWeek && x.EndTime < endOfWeek)
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

        return new GetBrandWeekEventStatisticsResult(groupedEvents.OrderBy(dto => dto.Date).ToList());
    }

    private DateTimeOffset StartOfWeek(DateTimeOffset dt, DayOfWeek startOfWeek)
    {
        int diff = (7 + (dt.DayOfWeek - startOfWeek)) % 7;
        return dt.AddDays(-1 * diff).Date;
    }
}
