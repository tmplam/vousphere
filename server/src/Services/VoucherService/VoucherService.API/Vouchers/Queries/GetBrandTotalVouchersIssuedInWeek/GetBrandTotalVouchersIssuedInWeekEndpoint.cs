using BuildingBlocks.Auth.Constants;
using BuildingBlocks.Shared;
using Mapster;
using Microsoft.AspNetCore.Mvc;

namespace VoucherService.API.Vouchers.Queries.GetBrandTotalVouchersIssuedInWeek;

public record GetBrandTotalVouchersIssuedInWeekRequest(DateTimeOffset CurrentDate);

public class GetBrandTotalVouchersIssuedInWeekEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/vouchers/brand/week-vouchers-issued", async (
            [AsParameters] GetBrandTotalVouchersIssuedInWeekRequest request,
            [FromServices] ISender sender) =>
        {
            var query = request.Adapt<GetBrandTotalVouchersIssuedInWeekQuery>();

            var result = await sender.Send(query);

            return Results.Ok(ApiResult.Success(result.WeekVouchersIssued));
        })
            .RequireAuthorization(AuthPolicy.Brand);
    }
}
