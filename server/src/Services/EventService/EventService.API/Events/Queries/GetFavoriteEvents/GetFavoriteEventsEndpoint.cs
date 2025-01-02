namespace EventService.API.Events.Queries.GetFavoriteEvents;

public class GetFavoriteEventsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/events/favorite-events", async (
            [FromBody] List<Guid> eventIds,
            [FromServices] ISender sender) =>
        {
            var query = new GetFavoriteEventsQuery(eventIds);
            var result = await sender.Send(query);
            return Results.Ok(result.Events);
        });
    }
}
