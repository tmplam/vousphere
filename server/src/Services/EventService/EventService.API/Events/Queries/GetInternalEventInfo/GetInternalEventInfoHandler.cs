namespace EventService.API.Events.Queries.GetInternalEventInfo;

public record GetInternalEventInfoQuery(Guid EventId) : IQuery<GetInternalEventInfoResult>;
public record GetInternalEventInfoResult(
    Guid EventId,
    Guid BrandId,
    string Status,
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
            return null!;

        var result = new GetInternalEventInfoResult(
            existingEvent.Id,
            existingEvent.BrandId,
            existingEvent.Status.ToString(),
            existingEvent.VoucherTypes,
            existingEvent.Games,
            existingEvent.Item);


        return result;
    }
}
