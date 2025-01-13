using BuildingBlocks.Shared;
using Microsoft.AspNetCore.Mvc;

namespace VoucherService.API.Vouchers.Queries.GetBrandTotalRedeemedVouchers;

public class GetBrandTotalRedeemedVouchersEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/vouchers/brand/total-redeemed", async ([FromServices] ISender sender) =>
        {
            var query = new GetBrandTotalRedeemedVouchersQuery();

            var result = await sender.Send(query);

            return Results.Ok(ApiResult.Success(result));
        });
    }
}
