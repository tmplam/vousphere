namespace EventService.API.Features.Events.Commands.ApproveEvent;

public class ApproveEventEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPatch("/api/events/{eventId:guid}/approve", async ([FromRoute] Guid eventId, [FromServices] ISender sender) =>
        {
            var command = new ApproveEventCommand(eventId);
            
            var result = await sender.Send(command);

            return Results.NoContent();
        })
            .RequireAuthorization(AuthPolicy.Admin);
    }
}
