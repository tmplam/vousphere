using UserService.Application.Dtos;
using UserService.Application.Features.Users.Queries.GetBrands;

namespace UserService.API.Endpoints;

public record GetPopularBrandsRequest(
    int Page = 1,
    int PerPage = 10,
    string Keyword = "");
public record GetPopularBrandsResponse(PaginationResult<UserDto> Brands);

public class GetPopularBrandsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/brands/popular", async (
            [AsParameters] GetBrandsRequest request,
            ISender sender) =>
        {
            var query = request.Adapt<GetBrandsQuery>();
            var result = await sender.Send(query);
            var response = result.Adapt<GetBrandsResponse>();
            return Results.Ok(ApiResult.Success(response.Brands));
        });
    }
}
