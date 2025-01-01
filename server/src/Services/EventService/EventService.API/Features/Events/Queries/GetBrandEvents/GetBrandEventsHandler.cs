namespace EventService.API.Features.Events.Queries.GetBrandEvents;

public record GetBrandEventsQuery(
    int Page = 1,
    int PerPage = 10,
    string Keyword = "",
    DateTimeOffset? StartTime = null,
    DateTimeOffset? EndTime = null,
    EventStatus? Status = null) : IQuery<GetBrandEventsResult>;
public record GetBrandEventsResult(PaginationResult<EventDto> Events);


public class GetBrandEventsHandler(
    IDocumentSession session,
    IClaimService claimService,
    IMediaApi mediaService)
    : IQueryHandler<GetBrandEventsQuery, GetBrandEventsResult>
{
    public async Task<GetBrandEventsResult> Handle(GetBrandEventsQuery query, CancellationToken cancellationToken)
    {
        var brandId = Guid.Parse(claimService.GetUserId());

        var eventsQuery = session.Query<Event>().Where(e => e.BrandId == brandId);

        if (!string.IsNullOrWhiteSpace(query.Keyword))
            eventsQuery = eventsQuery.Where(e => e.Name.NgramSearch(query.Keyword) || e.Description.NgramSearch(query.Keyword));

        if (query.StartTime.HasValue)
            eventsQuery = eventsQuery.Where(e => e.StartTime >= query.StartTime.Value);

        if (query.EndTime.HasValue)
            eventsQuery = eventsQuery.Where(e => e.EndTime <= query.EndTime.Value);

        var events = await eventsQuery.ToPagedListAsync(query.Page, query.PerPage, cancellationToken);

        var eventDtos = events.ToList().Adapt<List<EventDto>>();

        var imageIds = eventDtos.SelectMany(e =>
        {
            if (e.Item == null) return [e.ImageId];
            return new[] { e.ImageId, e.Item.ImageId };
        });
        var imageUrlsDictionary = await mediaService.GetImageUrlsAsync(imageIds);

        foreach (var eventDto in eventDtos)
        {
            if (imageUrlsDictionary.TryGetValue(eventDto.ImageId, out var eventImageUrl))
            {
                eventDto.Image = eventImageUrl;
            }

            if (eventDto.Item != null)
            {
                if (imageUrlsDictionary.TryGetValue(eventDto.Item.ImageId, out var itemImageUrl))
                {
                    eventDto.Item.Image = itemImageUrl;
                }
            }
        }


        return new GetBrandEventsResult(
            PaginationResult<EventDto>.Create(
                events.PageNumber,
                events.PageSize,
                events.TotalItemCount,
                events.PageCount,
                eventDtos));
    }
}
