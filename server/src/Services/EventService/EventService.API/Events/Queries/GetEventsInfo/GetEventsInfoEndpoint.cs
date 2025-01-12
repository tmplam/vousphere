namespace EventService.API.Events.Queries.GetEventsInfo;

public class GetEventsInfoEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/events/events-info", async (
            [FromBody] List<Guid> eventIds,
            [FromServices] ISender sender) =>
        {
            var query = new GetEventsInfoQuery(eventIds);
            var result = await sender.Send(query);
            return Results.Ok(result.Events);
        });
    }
}
