namespace GameService.API.Features.Games.Queries.GetAllGames;

public record GetAllGamesResponse(IEnumerable<Game> Games);


public class GetAllGamesEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/games", async ([FromServices] ISender sender) =>
        {
            var result = await sender.Send(new GetAllGamesQuery());

            var response = result.Adapt<GetAllGamesResponse>();

            return Results.Ok(ApiResult.Success(response, "Get all games successfully"));
        })
            .RequireAuthorization(AuthPolicy.BrandOrAdmin);
    }
}
