namespace EventService.API.Events.Queries.GetTotalEvents;

public class GetTotalEventsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/events/total-events", async (
            ISender sender) =>
        {
            var query = new GetTotalEventsQuery();
            var result = await sender.Send(query);

            return Results.Ok(ApiResult.Success(result));
        })
            .RequireAuthorization(AuthPolicy.Admin);
    }
}
