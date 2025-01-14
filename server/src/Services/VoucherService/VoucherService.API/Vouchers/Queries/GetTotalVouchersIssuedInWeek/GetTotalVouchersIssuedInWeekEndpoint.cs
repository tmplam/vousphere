using BuildingBlocks.Auth.Constants;
using BuildingBlocks.Shared;
using Mapster;
using Microsoft.AspNetCore.Mvc;

namespace VoucherService.API.Vouchers.Queries.GetTotalVouchersIssuedInWeek;

public record GetTotalVouchersIssuedInWeekRequest(DateTimeOffset CurrentDate);

public class GetBrandTotalVouchersIssuedInWeekEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/vouchers/week-vouchers-issued", async (
            [AsParameters] GetTotalVouchersIssuedInWeekRequest request,
            [FromServices] ISender sender) =>
        {
            var query = request.Adapt<GetTotalVouchersIssuedInWeekQuery>();

            var result = await sender.Send(query);

            return Results.Ok(ApiResult.Success(result.WeekVouchersIssued));
        })
            .RequireAuthorization(AuthPolicy.Admin);
    }
}
