namespace EventService.API.Features.Events.Queries.GetEventById;

public record GetEventByIdQuery(Guid EventId) : IQuery<GetEventByIdResult>;
public record GetEventByIdResult(Event Event);


public class GetEventByIdHandler(
    IDocumentSession session) 
    : IQueryHandler<GetEventByIdQuery, GetEventByIdResult>
{
    public async Task<GetEventByIdResult> Handle(GetEventByIdQuery query, CancellationToken cancellationToken)
    {
        var existingEvent = await session.LoadAsync<Event>(query.EventId, cancellationToken);

        if (existingEvent == null)
            throw new NotFoundException("Event not found");

        return new GetEventByIdResult(existingEvent);
    }
}
