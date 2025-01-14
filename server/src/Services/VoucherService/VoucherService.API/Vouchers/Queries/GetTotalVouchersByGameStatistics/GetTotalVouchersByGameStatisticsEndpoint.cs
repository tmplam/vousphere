using BuildingBlocks.Auth.Constants;
using BuildingBlocks.Shared;

namespace VoucherService.API.Vouchers.Queries.GetTotalVouchersByGameStatistics;

public class GetTotalVouchersByGameStatisticsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/vouchers/game-statistics", async (ISender sender) =>
        {
            var query = new GetTotalVouchersByGameStatisticsQuery();
            var result = await sender.Send(query);
            return Results.Ok(ApiResult.Success(result.GameReleasedVouchers));
        })
            .RequireAuthorization(AuthPolicy.Admin);
    }
}
