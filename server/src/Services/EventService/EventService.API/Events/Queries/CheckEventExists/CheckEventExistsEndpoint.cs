namespace EventService.API.Events.Queries.CheckEventExists;

public class CheckEventExistsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/events/{eventId:guid}/exists", async (
            [FromRoute] Guid eventId,
            [FromServices] ISender sender) =>
        {
            var query = new CheckEventExistsQuery(eventId);

            var result = await sender.Send(query);

            return Results.Ok(result);
        });
    }
}
