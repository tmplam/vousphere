namespace EventService.API.Events.Queries.GetEventsInfo;

public record GetEventsInfoQuery(IEnumerable<Guid> EventIds) : IQuery<GetEventsInfoResult>;
public record GetEventsInfoResult(Dictionary<Guid, EventDto> Events);


public class GetEventsInfoHandler(
    IDocumentSession _session,
    IMediaApi _mediaService)
    : IQueryHandler<GetEventsInfoQuery, GetEventsInfoResult>
{
    public async Task<GetEventsInfoResult> Handle(GetEventsInfoQuery query, CancellationToken cancellationToken)
    {
        var events = _session.Query<Event>()
            .Where(e => query.EventIds.Contains(e.Id))
            .ProjectToType<EventDto>();

        if (!events.Any())
            return new GetEventsInfoResult(new Dictionary<Guid, EventDto>());

        var itemImageIds = events.Select(e => e.Item != null ? e.Item.ImageId : Guid.Empty).Distinct();

        var images = await _mediaService.GetImageUrlsAsync(itemImageIds);

        foreach (var @event in events)
        {
            if (@event.Item != null && images.ContainsKey(@event.Item.ImageId))
                @event.Item.Image = images[@event.Item.ImageId];
        }

        var eventDictionary = events.ToDictionary(e => e.Id);

        return new GetEventsInfoResult(eventDictionary);
    }
}
