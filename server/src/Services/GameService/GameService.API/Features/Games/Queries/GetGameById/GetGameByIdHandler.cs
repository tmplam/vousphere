namespace GameService.API.Features.Games.Queries.GetGameById;

public record GetGameByIdQuery(Guid GameId) : IQuery<GetGameByIdResult>;
public record GetGameByIdResult(GameDto Game);


internal sealed class GetGameByIdHandler(
    IDocumentSession _session,
    IMediaApi _mediaService) : IQueryHandler<GetGameByIdQuery, GetGameByIdResult>
{
    public async Task<GetGameByIdResult> Handle(GetGameByIdQuery query, CancellationToken cancellationToken)
    {
        var game = await _session.LoadAsync<Game>(query.GameId);

        if (game == null)
            throw new NotFoundException($"Game with ID {query.GameId} not found.");

        var gameDto = game.Adapt<GameDto>();

        gameDto.Image = await _mediaService.GetImageUrlAsync(gameDto.ImageId);

        return new GetGameByIdResult(gameDto);
    }
}
