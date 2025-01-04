using UserService.Application.Features.Users.Queries.GetBrandsInfo;

namespace UserService.API.Endpoints;

public class GetBrandsInfoEndpoint : ICarterModule
{
    // Internal use only
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/users/brands-info", async (
            List<Guid> brandIds,
            ISender sender) =>
        {
            var query = new GetBrandsInfoQuery(brandIds);
            var result = await sender.Send(query);

            return Results.Ok(result.Brands);
        });
    }
}
