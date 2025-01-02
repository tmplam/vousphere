using UserService.Application.Features.Favorites.Commands.RemoveFromFavorite;

namespace UserService.API.Endpoints;


public class RemoveFromFavoriteEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/users/favorites/{eventId:guid}", async (Guid eventId, ISender sender) =>
        {
            var command = new RemoveFromFavoriteCommand(eventId);
            await sender.Send(command);
            return Results.NoContent();
        })
            .RequireAuthorization();
    }
}
