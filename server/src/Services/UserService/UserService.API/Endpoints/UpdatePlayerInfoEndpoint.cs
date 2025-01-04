using BuildingBlocks.Auth.Constants;
using UserService.Application.Features.Users.Commands.UpdatePlayerInfo;

namespace UserService.API.Endpoints;

public record UpdatePlayerInfoRequest(
    string Name,
    string PhoneNumber,
    DateOnly DateOfBirth,
    string Gender);

public class UpdatePlayerInfoEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/api/users/player-info", async (UpdatePlayerInfoRequest request, ISender sender) =>
        {
            var command = request.Adapt<UpdatePlayerInfoCommand>();
            var result = await sender.Send(command);
            return Results.NoContent();
        })
            .RequireAuthorization(AuthPolicy.Player);
    }
}
