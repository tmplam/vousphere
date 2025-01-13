using BuildingBlocks.Auth.Constants;
using Microsoft.AspNetCore.Mvc;
using UserService.Application.Features.Users.Queries.GetTotalPlayers;

namespace UserService.API.Endpoints;

public class GetTotalPlayersEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/players/total-players", async ([FromServices] ISender sender) =>
        {
            var query = new GetTotalPlayersQuery();
            var result = await sender.Send(query);

            return Results.Ok(ApiResult.Success(result));
        })
            .RequireAuthorization(AuthPolicy.Admin);
    }
}
