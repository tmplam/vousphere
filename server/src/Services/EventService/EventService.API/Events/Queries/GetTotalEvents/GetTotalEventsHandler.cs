namespace EventService.API.Events.Queries.GetTotalEvents;

public record GetTotalEventsQuery() : IQuery<GetTotalEventsResult>;
public record GetTotalEventsResult(long TotalEvents);


public class GetTotalEventsHandler(
    IDocumentSession _session) 
    : IQueryHandler<GetTotalEventsQuery, GetTotalEventsResult>
{
    public async Task<GetTotalEventsResult> Handle(GetTotalEventsQuery query, CancellationToken cancellationToken)
    {
        var totalEvents = await _session.Query<Event>().CountAsync();

        return new GetTotalEventsResult(totalEvents);
    }
}
