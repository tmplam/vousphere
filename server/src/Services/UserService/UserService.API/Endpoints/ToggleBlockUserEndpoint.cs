using BuildingBlocks.Auth.Constants;
using UserService.Application.Features.Users.Commands.ToggleBlockUser;

namespace UserService.API.Endpoints;

public record ToggleBlockUserResponse(Guid UserId);


public class ToggleBlockUserEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPatch("/api/users/{userId:guid}/toggle-block", async (Guid userId, ISender sender) =>
        {
            var command = new ToggleBlockUserCommand(userId);
            var result = await sender.Send(command);
            var response = result.Adapt<ToggleBlockUserResponse>();
            return Results.Ok(ApiResult.Success(response, result.Message));
        })
            .RequireAuthorization(AuthPolicy.Admin); 
    }
}
