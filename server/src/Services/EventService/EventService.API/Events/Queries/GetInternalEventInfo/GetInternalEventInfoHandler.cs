namespace EventService.API.Events.Queries.GetInternalEventInfo;

public record GetInternalEventInfoQuery(Guid EventId) : IQuery<GetInternalEventInfoResult>;
public record GetInternalEventInfoResult(
    Guid EventId,
    IEnumerable<VoucherType> VoucherTypes,
    IEnumerable<EventGame> Games,
    Item? Item);


public class GetInternalEventInfoHandler(
    IDocumentSession _session) 
    : IQueryHandler<GetInternalEventInfoQuery, GetInternalEventInfoResult>
{
    public async Task<GetInternalEventInfoResult> Handle(GetInternalEventInfoQuery query, CancellationToken cancellationToken)
    {
        var existingEvent = await _session.LoadAsync<Event>(query.EventId, cancellationToken);

        if (existingEvent == null)
            throw new NotFoundException("Event not found");

        var result = new GetInternalEventInfoResult(
            existingEvent.Id,
            existingEvent.VoucherTypes,
            existingEvent.Games,
            existingEvent.Item);


        return result;
    }
}
