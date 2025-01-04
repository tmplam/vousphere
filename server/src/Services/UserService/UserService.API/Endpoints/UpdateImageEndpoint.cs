using UserService.Application.Features.Users.Commands.UpdateImage;

namespace UserService.API.Endpoints;

public record UpdateImageRequest(Guid ImageId);

public class UpdateImageEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPatch("/api/users/image", async (UpdateImageRequest request, ISender sender) =>
        {
            var command = request.Adapt<UpdateImageCommand>();
            var result = await sender.Send(command);
            return Results.NoContent();
        })
            .RequireAuthorization();
    }
}
