namespace EventService.API.Features.Events.Commands.RejectEvent;

public record RejectEventRequest(string Comment);


public class RejectEventEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPatch("/api/events/{eventId:guid}/reject", async (
            [FromRoute] Guid eventId,
            [FromBody] RejectEventRequest request,
            [FromServices] ISender sender) =>
        {
            var command = new RejectEventCommand(eventId, request.Comment);

            var result = await sender.Send(command);

            return Results.NoContent();
        })
            .RequireAuthorization(AuthPolicy.Admin);
    }
}
