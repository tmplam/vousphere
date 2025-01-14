using BuildingBlocks.Auth.Constants;
using BuildingBlocks.Shared;

namespace VoucherService.API.Vouchers.Queries.GetBrandTotalVouchersByGameStatistics;

public class GetBrandTotalVouchersByGameStatisticsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/vouchers/brand/game-statistics", async (ISender sender) =>
        {
            var query = new GetBrandTotalVouchersByGameStatisticsQuery();
            var result = await sender.Send(query);
            return Results.Ok(ApiResult.Success(result.GameReleasedVouchers));
        })
            .RequireAuthorization(AuthPolicy.Brand);
    }
}
