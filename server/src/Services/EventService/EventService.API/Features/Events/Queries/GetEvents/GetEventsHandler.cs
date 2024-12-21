namespace EventService.API.Features.Events.Queries.GetEvents;

public record GetEventsQuery() : IQuery<GetEventsResult>;
public record GetEventsResult();


public class GetEventsHandler : IQueryHandler<GetEventsQuery, GetEventsResult>
{
    public Task<GetEventsResult> Handle(GetEventsQuery query, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
