namespace EventService.API.Events.Queries.GetFavoriteEvents;

public record GetFavoriteEventsQuery(List<Guid> EventIds) : IQuery<GetFavoriteEventsResult>;
public record GetFavoriteEventsResult(IEnumerable<FavoriteEventDto> Events);


public class GetFavoriteEventsHandler(
    IDocumentSession session,
    IMediaApi mediaService) 
    : IQueryHandler<GetFavoriteEventsQuery, GetFavoriteEventsResult>
{
    public async Task<GetFavoriteEventsResult> Handle(GetFavoriteEventsQuery query, CancellationToken cancellationToken)
    {
        var eventDtos = await session
            .Query<Event>()
            .Where(e => query.EventIds.Contains(e.Id))
            .ProjectToType<FavoriteEventDto>()
            .ToListAsync(cancellationToken);

        var imageIds = eventDtos.Select(e => e.ImageId);

        var imageUrlsDictionary = await mediaService.GetImageUrlsAsync(imageIds);

        foreach (var eventDto in eventDtos)
        {
            if (imageUrlsDictionary.TryGetValue(eventDto.ImageId, out var eventImageUrl))
            {
                eventDto.Image = eventImageUrl;
            }
        }

        return new GetFavoriteEventsResult(eventDtos);
    }
}
