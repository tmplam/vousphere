using BuildingBlocks.Auth.Constants;
using Microsoft.AspNetCore.Mvc;

namespace UserService.API.Endpoints;

public class GetTotalBrandsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/brands/total-brands", async ([FromServices] ISender sender) =>
        {
            //var totalBrands = await userService.GetTotalBrandsAsync();
            //return Results.Ok(totalBrands);
        })
            .RequireAuthorization(AuthPolicy.Admin);
    }
}
