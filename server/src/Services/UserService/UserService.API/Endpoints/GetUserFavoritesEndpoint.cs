using UserService.Application.Features.Favorites.Queries.GetUserFavorites;

namespace UserService.API.Endpoints;

public record GetUserFavoritesRequest(int Page = 1, int PerPage = 5);


public class GetUserFavoritesEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users/favorites", async (
            [AsParameters] GetUserFavoritesRequest request, 
            ISender sender) =>
        {
            var query = request.Adapt<GetUserFavoritesQuery>();
            var result = await sender.Send(query);
            return Results.Ok(ApiResult.Success(result.UserFavorites));
        })
            .RequireAuthorization();
    }
}
