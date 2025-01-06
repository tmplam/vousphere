using BuildingBlocks.Auth.Constants;
using UserService.Application.Features.Users.Queries.GetUserById;

namespace UserService.API.Endpoints;

public class GetUserByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users/{userId:guid}", async (Guid userId, ISender sender) =>
        {
            var query = new GetUserByIdQuery(userId);
            var result = await sender.Send(query);

            return Results.Ok(ApiResult.Success(result.User));
        })
            .RequireAuthorization(AuthPolicy.Admin);
    }
}
