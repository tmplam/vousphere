namespace EventService.API.Features.Events.Queries.GetEventById;

public record GetEventByIdQuery(Guid EventId) : IQuery<GetEventByIdResult>;
public record GetEventByIdResult(EventDto Event);


public class GetEventByIdHandler(
    IDocumentSession session,
    IMediaApi mediaService) 
    : IQueryHandler<GetEventByIdQuery, GetEventByIdResult>
{
    public async Task<GetEventByIdResult> Handle(GetEventByIdQuery query, CancellationToken cancellationToken)
    {
        var existingEvent = await session.LoadAsync<Event>(query.EventId, cancellationToken);

        if (existingEvent == null)
            throw new NotFoundException("Event not found");

        var eventDto = existingEvent.Adapt<EventDto>();

        if (eventDto.Item == null)
        {
            eventDto.Image = await mediaService.GetImageUrlAsync(existingEvent.ImageId);
        }
        else
        {
            var imageUrls = await mediaService.GetImageUrlsAsync([existingEvent.ImageId, eventDto.Item.ImageId]);
            eventDto.Image = imageUrls[existingEvent.ImageId];
            eventDto.Item.Image = imageUrls[eventDto.Item.ImageId];
        }

        return new GetEventByIdResult(eventDto);
    }
}
