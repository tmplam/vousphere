using BuildingBlocks.Auth.Constants;
using BuildingBlocks.Shared;
using Mapster;
using Microsoft.AspNetCore.Mvc;

namespace VoucherService.API.Vouchers.Queries.GetUserVouchers;

public record GetUserVouchersRequest(
    int Page = 1, 
    int PerPage = 10);

public class GetUserVouchersEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/vouchers", async (
            [AsParameters] GetUserVouchersRequest request,
            [FromServices] ISender sender) =>
        {
            var query = request.Adapt<GetUserVouchersQuery>();
            var result = await sender.Send(query);
            return Results.Ok(ApiResult.Success(result.Vouchers));
        })
            .RequireAuthorization(AuthPolicy.Player);
    }
}
