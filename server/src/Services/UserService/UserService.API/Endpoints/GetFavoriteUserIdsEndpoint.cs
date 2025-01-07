using UserService.Application.Features.Favorites.Queries.GetFavoriteUserIds;

namespace UserService.API.Endpoints;

public class GetFavoriteUserIdsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users/favorites/{eventId:guid}/user-ids", async (
            Guid eventId,
            ISender sender) =>
        {
            var query = new GetFavoriteUserIdsQuery(eventId);
            var result = await sender.Send(query);
            return Results.Ok(result.UserIds);
        });
    }
}
