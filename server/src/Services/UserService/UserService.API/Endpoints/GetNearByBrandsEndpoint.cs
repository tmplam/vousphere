using UserService.Application.Dtos;
using UserService.Application.Features.Users.Queries.GetNearByBrands;

namespace UserService.API.Endpoints;

public record GetNearByBrandsRequest(
    double Latitude,
    double Longitude,
    double Radius,
    int Page = 1,
    int PerPage = 10);
public record GetNearByBrandsResponse(PaginationResult<UserDto> Brands);

public class GetNearByBrandsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/brands/near-by", async (
            [AsParameters] GetNearByBrandsRequest request,
            ISender sender) =>
        {
            var query = request.Adapt<GetNearByBrandsQuery>();
            var result = await sender.Send(query);
            var response = result.Adapt<GetNearByBrandsResult>();
            return Results.Ok(ApiResult.Success(response.Brands));
        });
    }
}
