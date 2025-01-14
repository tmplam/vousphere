namespace EventService.API.Events.Queries.GetWeekEventStatistics;

public record GetWeekEventStatisticsRequest(DateTimeOffset CurrentDate);

public class GetWeekEventStatisticsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/events/week-status", async (
            [AsParameters] GetWeekEventStatisticsRequest request,
            [FromServices] ISender sender) =>
        {
            var query = request.Adapt<GetWeekEventStatisticsQuery>();

            var result = await sender.Send(query);

            return Results.Ok(ApiResult.Success(result.WeekEventStatus));
        })
            .RequireAuthorization(AuthPolicy.Admin);
    }
}
