﻿using BuildingBlocks.Auth.Constants;
using Microsoft.AspNetCore.Mvc;
using UserService.Application.Features.Users.Queries.GetTotalBrands;

namespace UserService.API.Endpoints;

public class GetTotalBrandsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/brands/total-brands", async ([FromServices] ISender sender) =>
        {
            var query = new GetTotalBrandsQuery();
            var result = await sender.Send(query);

            return Results.Ok(ApiResult.Success(result));
        })
            .RequireAuthorization(AuthPolicy.Admin);
    }
}
