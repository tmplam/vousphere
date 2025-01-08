namespace EventService.API.Events.Queries.GetInternalEventInfo;

public class GetInternalEventInfoEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/events/{eventId:guid}/internal-info", async (
            [FromRoute] Guid eventId,
            [FromServices] ISender sender) =>
        {
            var query = new GetInternalEventInfoQuery(eventId);
            var result = await sender.Send(query);
            return Results.Ok(result);
        });
    }
}
