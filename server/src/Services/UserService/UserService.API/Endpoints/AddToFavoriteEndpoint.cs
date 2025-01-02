using UserService.Application.Features.Favorites.Commands.AddToFavorite;

namespace UserService.API.Endpoints;

public record AddToFavoriteRequest(Guid EventId);

public class AddToFavoriteEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/users/favorites", async (AddToFavoriteRequest request, ISender sender) =>
        {
            var command = request.Adapt<AddToFavoriteCommand>();

            await sender.Send(command);

            return Results.NoContent();
        })
            .RequireAuthorization();
    }
}
