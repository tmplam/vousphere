using UserService.Application.Features.Users.Queries.GetProfile;

namespace UserService.API.Endpoints;

public class GetProfileEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users/profile", async (ISender sender) =>
        {
            var query = new GetProfileQuery();
            var result = await sender.Send(query);

            return Results.Ok(ApiResult.Success(result.User));
        })
            .RequireAuthorization();
    }
}
