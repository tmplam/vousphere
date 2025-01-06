namespace GameService.API.Features.Games.Queries.GetGameById;

public class GetGameByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/games/{gameId:guid}", async (Guid gameId, ISender sender) =>
        {
            var query = new GetGameByIdQuery(gameId);
            var result = await sender.Send(query);
            return Results.Ok(ApiResult.Success(result.Game));
        })
            .RequireAuthorization();
    }
}
