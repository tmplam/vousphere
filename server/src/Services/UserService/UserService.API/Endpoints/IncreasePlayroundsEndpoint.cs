using BuildingBlocks.Auth.Constants;
using Microsoft.AspNetCore.Mvc;
using UserService.Application.Features.Users.Commands.IncreasePlayrounds;

namespace UserService.API.Endpoints;

public record IncreasePlayroundsRequest(int NumberOfPlayrounds);

public class IncreasePlayroundsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/users/increase-playrounds", async (
            [FromBody] IncreasePlayroundsRequest request,
            [FromServices] ISender sender) =>
        {
            var command = new IncreasePlayroundsCommand(request.NumberOfPlayrounds);
            var result = await sender.Send(command);

            return Results.NoContent();
        })
            .RequireAuthorization(AuthPolicy.Player);
    }
}
