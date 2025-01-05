namespace GameService.API.Features.Games.Queries.GetAllGames;

public record GetAllGamesQuery() : IQuery<GetAllGamesResult>;
public record GetAllGamesResult(IEnumerable<GameDto> Games);


public class GetAllGamesHandler(
    IDocumentSession session,
    IMediaApi mediaService) : IQueryHandler<GetAllGamesQuery, GetAllGamesResult>
{
    public async Task<GetAllGamesResult> Handle(GetAllGamesQuery query, CancellationToken cancellationToken)
    {
        var games = await session.Query<Game>().ToListAsync(cancellationToken);

        var gameDtos = games.ToList().Adapt<List<GameDto>>();

        var imageIds = gameDtos.Select(x => x.ImageId);

        var imageUrlsDictionary = await mediaService.GetImageUrlsAsync(imageIds);

        foreach (var gameDto in gameDtos)
        {
            if (imageUrlsDictionary.TryGetValue(gameDto.ImageId, out var imageUrl))
            {
                gameDto.Image = imageUrl;
            }
        }

        return new GetAllGamesResult(gameDtos);
    }
}
