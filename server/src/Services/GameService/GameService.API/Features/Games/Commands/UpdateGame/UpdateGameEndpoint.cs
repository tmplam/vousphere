namespace GameService.API.Features.Games.Commands.UpdateGame;

public record UpdateGameRequest(
    string Name,
    string Description,
    Guid ImageId);

public class UpdateGameEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/api/games/{gameId:guid}", async (
            [FromRoute] Guid gameId,
            [FromBody] UpdateGameRequest request,
            [FromServices] ISender sender) =>
        {
            var command = new UpdateGameCommand(
                gameId,
                request.Name,
                request.Description,
                request.ImageId);

            var result = await sender.Send(command);

            return Results.NoContent();
        })
            .RequireAuthorization(AuthPolicy.Admin);
    }
}
