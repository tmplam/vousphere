namespace MediaService.API.Medias.Queries.GetImageUrlById;

public record GetImageUrlByIdQuery(Guid ImageId) : IQuery<GetImageUrlByIdResult>;
public record GetImageUrlByIdResult(string ImageUrl);


public class GetImageUrlByIdHandler(
    IDocumentSession session) : IQueryHandler<GetImageUrlByIdQuery, GetImageUrlByIdResult>
{
    public async Task<GetImageUrlByIdResult> Handle(GetImageUrlByIdQuery query, CancellationToken cancellationToken)
    {
        var media = await session.LoadAsync<Media>(query.ImageId, cancellationToken);

        return new GetImageUrlByIdResult(media?.Url ?? string.Empty);
    }
}