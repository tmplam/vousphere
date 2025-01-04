using BuildingBlocks.Auth.Constants;
using BuildingBlocks.Auth.Enums;
using UserService.Application.Dtos;
using UserService.Application.Features.Users.Queries.GetUsers;

namespace UserService.API.Endpoints;

public record GetUsersRequest(
    int Page = 1,
    int PerPage = 10,
    string Keyword = "",
    UserRole? Role = null);
public record GetUsersResponse(PaginationResult<UserDto> Users);


public class GetUsersEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users", async (
            [AsParameters] GetUsersRequest request,
            ISender sender) =>
        {
            var query = request.Adapt<GetUsersQuery>();
            var result = await sender.Send(query);
            var response = result.Adapt<GetUsersResponse>();
            return Results.Ok(ApiResult.Success(response.Users));
        })
            .RequireAuthorization(AuthPolicy.Admin);
    }
}
