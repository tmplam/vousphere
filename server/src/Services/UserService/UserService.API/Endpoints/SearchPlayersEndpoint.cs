using UserService.Application.Features.Users.Queries.SearchPlayers;

namespace UserService.API.Endpoints;

public record SearchPlayersRequest(string Keyword = "");

public class SearchPlayersEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users/players", async (
            [AsParameters] SearchPlayersRequest request, 
            ISender sender) =>
        {
            var query = request.Adapt<SearchPlayersQuery>();
            var result = await sender.Send(query);

            return Results.Ok(ApiResult.Success(result.Players));
        })
            .RequireAuthorization();
    }
}
