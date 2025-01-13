using BuildingBlocks.Auth.Constants;
using Microsoft.AspNetCore.Mvc;
using UserService.Application.Features.Users.Commands.GiftPlayrounds;

namespace UserService.API.Endpoints;

public record GiftPlayroundsRequest(Guid RecipientId, int NumberOfRounds);

public class GiftPlayroundsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/users/gift-playrounds", async (
            [FromBody] GiftPlayroundsRequest request,
            [FromServices] ISender sender) =>
        {
            var command = request.Adapt<GiftPlayroundsCommand>();
            var result = await sender.Send(command);
            return Results.NoContent();
        })
            .RequireAuthorization(AuthPolicy.Player);
    }
}
