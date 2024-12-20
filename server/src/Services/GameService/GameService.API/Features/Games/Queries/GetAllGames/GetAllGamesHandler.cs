namespace GameService.API.Features.Games.Queries.GetAllGames;

public record GetAllGamesQuery() : IQuery<GetAllGamesResult>;
public record GetAllGamesResult(IEnumerable<Game> Games);


public class GetAllGamesHandler(IDocumentSession session) : IQueryHandler<GetAllGamesQuery, GetAllGamesResult>
{
    public async Task<GetAllGamesResult> Handle(GetAllGamesQuery request, CancellationToken cancellationToken)
    {
        var games = await session.Query<Game>().ToListAsync(cancellationToken);

        return new GetAllGamesResult(games);
    }
}
