namespace EventService.API.Events.Queries.GetEventById;

public record GetEventByIdQuery(Guid EventId) : IQuery<GetEventByIdResult>;
public record GetEventByIdResult(EventDto Event);


public class GetEventByIdHandler(
    IDocumentSession _session,
    IMediaApi _mediaService,
    IUserApi _userService)
    : IQueryHandler<GetEventByIdQuery, GetEventByIdResult>
{
    public async Task<GetEventByIdResult> Handle(GetEventByIdQuery query, CancellationToken cancellationToken)
    {
        var existingEvent = await _session.LoadAsync<Event>(query.EventId, cancellationToken);

        if (existingEvent == null)
            throw new NotFoundException("Event not found");

        var eventDto = existingEvent.Adapt<EventDto>();

        var brandTask = _userService.GetBrandInfoAsync(eventDto.BrandId);

        if (eventDto.Item == null)
        {
            eventDto.Image = await _mediaService.GetImageUrlAsync(existingEvent.ImageId);
        }
        else
        {
            var imageUrlsTask = _mediaService.GetImageUrlsAsync(eventDto.ImageId, eventDto.Item.ImageId);
            var imageUrls = await imageUrlsTask;
            eventDto.Image = imageUrls.TryGetValue(eventDto.ImageId, out var eventImage) ? eventImage : string.Empty;
            eventDto.Item.Image = imageUrls.TryGetValue(eventDto.Item.ImageId, out var itemImage) ? itemImage : string.Empty;
        }

        eventDto.Brand = await brandTask;

        return new GetEventByIdResult(eventDto);
    }
}
