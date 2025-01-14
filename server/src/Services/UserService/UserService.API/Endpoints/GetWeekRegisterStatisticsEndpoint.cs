using BuildingBlocks.Auth.Constants;
using Microsoft.AspNetCore.Mvc;
using UserService.Application.Features.Users.Queries.GetCurrentWeekRegisterStatistics;

namespace UserService.API.Endpoints;

public record GetWeekRegisterStatisticsRequest(DateTimeOffset CurrentDate);

public class GetWeekRegisterStatisticsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users/week-register-statistics", async (
            [AsParameters] GetWeekRegisterStatisticsRequest request,
            [FromServices] ISender sender) =>
        {
            var query = request.Adapt<GetWeekRegisterStatisticsQuery>();

            var result = await sender.Send(query);

            return Results.Ok(ApiResult.Success(result.WeekRegisters));
        })
            .RequireAuthorization(AuthPolicy.Admin);
    }
}
