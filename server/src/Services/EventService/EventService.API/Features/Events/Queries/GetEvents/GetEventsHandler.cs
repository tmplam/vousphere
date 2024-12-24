namespace EventService.API.Features.Events.Queries.GetEvents;

public record GetEventsQuery(
    int Page = 1,
    int PerPage = 10,
    string Keyword = "") : IQuery<GetEventsResult>;
public record GetEventsResult(PaginationResult<Event> Events);


public class GetEventsHandler(IDocumentSession session) : IQueryHandler<GetEventsQuery, GetEventsResult>
{
    public async Task<GetEventsResult> Handle(GetEventsQuery query, CancellationToken cancellationToken)
    {
        var eventsQuery = session.Query<Event>()
            .Where(e => e.Status == EventStatus.Approved && e.EndTime <= DateTimeOffset.UtcNow);

        if (!string.IsNullOrWhiteSpace(query.Keyword))
            eventsQuery = eventsQuery.Where(e => e.Name.NgramSearch(query.Keyword) || e.Description.NgramSearch(query.Keyword));

        var events = await eventsQuery.ToPagedListAsync(query.Page, query.PerPage, cancellationToken);


        return new GetEventsResult(
            PaginationResult<Event>.Create(
                events.PageNumber,
                events.PageSize,
                events.TotalItemCount,
                events.PageCount,
                events));
    }
}
