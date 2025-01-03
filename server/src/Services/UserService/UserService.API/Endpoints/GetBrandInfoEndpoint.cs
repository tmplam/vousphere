using UserService.Application.Features.Users.Queries.GetBrandInfo;

namespace UserService.API.Endpoints;

public class GetBrandInfoEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users/{brandId:guid}/brand-info", async (
            Guid brandId,
            ISender sender) =>
        {
            var query = new GetBrandInfoQuery(brandId);
            var result = await sender.Send(query);
            return Results.Ok(result.Brand);
        });
    }
}
