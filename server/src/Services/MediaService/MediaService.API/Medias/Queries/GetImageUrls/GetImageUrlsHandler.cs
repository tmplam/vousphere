namespace MediaService.API.Medias.Queries.GetImageUrls;

public record GetImageUrlsQuery(List<Guid> ImageIds) : IQuery<GetImageUrlsResult>;
public record GetImageUrlsResult(Dictionary<Guid, string> ImageUrls);


public class GetImageUrlsHandler(IDocumentSession session) : IQueryHandler<GetImageUrlsQuery, GetImageUrlsResult>
{
    public async Task<GetImageUrlsResult> Handle(GetImageUrlsQuery query, CancellationToken cancellationToken)
    {
        var imageUrls = session
            .Query<Media>()
            .Where(media => query.ImageIds.Contains(media.Id))
            .ToDictionary(media => media.Id, media => media.Url);
        return await Task.FromResult(new GetImageUrlsResult(imageUrls));
    }
}
