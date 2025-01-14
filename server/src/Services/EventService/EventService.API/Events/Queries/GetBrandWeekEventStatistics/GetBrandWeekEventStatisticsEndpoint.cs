namespace EventService.API.Events.Queries.GetBrandWeekEventStatistics;

public record GetBrandWeekEventStatisticsRequest(DateTimeOffset CurrentDate);

public class GetBrandWeekEventStatisticsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/events/brand/week-status", async (
            [AsParameters] GetBrandWeekEventStatisticsRequest request,
            [FromServices] ISender sender) =>
        {
            var query = request.Adapt<GetBrandWeekEventStatisticsQuery>();

            var result = await sender.Send(query);

            return Results.Ok(ApiResult.Success(result.WeekEventStatus));
        })
            .RequireAuthorization(AuthPolicy.Brand);
    }
}
