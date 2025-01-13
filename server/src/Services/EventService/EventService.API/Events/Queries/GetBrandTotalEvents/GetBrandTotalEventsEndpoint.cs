namespace EventService.API.Events.Queries.GetBrandTotalEvents;

public class GetBrandTotalEventsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/events/brand/total-events", async (
            ISender sender) =>
        {
            var query = new GetBrandTotalEventsQuery();
            var result = await sender.Send(query);

            return Results.Ok(ApiResult.Success(result));
        })
            .RequireAuthorization(AuthPolicy.Brand);
    }
}
