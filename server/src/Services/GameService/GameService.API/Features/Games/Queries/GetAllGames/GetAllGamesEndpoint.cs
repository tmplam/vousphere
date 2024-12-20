namespace GameService.API.Features.Games.Queries.GetAllGames;

public record GetAllGamesRequest();
public record GetAllGamesResponse(IEnumerable<Game> Games);


public class GetAllGamesEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/games", async (GetAllGamesRequest request, ISender sender) =>
        {
            var query = request.Adapt<GetAllGamesQuery>();

            var result = await sender.Send(query);

            var response = result.Adapt<GetAllGamesResponse>();

            return Results.Ok(response);
        });
    }
}
