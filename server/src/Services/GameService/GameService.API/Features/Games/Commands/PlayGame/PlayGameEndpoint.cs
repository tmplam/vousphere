namespace GameService.API.Features.Games.Commands.PlayGame;

public record PlayGameRequest(Guid EventId);

public class PlayGameEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/games/{gameId:required}/play", async (
            [FromRoute] string gameId,
            [AsParameters] PlayGameRequest request,
            ISender sender) =>
        {
            var command = new PlayGameCommand(gameId, request.EventId);
            var result = await sender.Send(command);

            return Results.Ok(ApiResult.Success(result));
        })
            .RequireAuthorization(AuthPolicy.Player);
    }
}
