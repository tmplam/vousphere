namespace EventService.API.Features.Events.Commands.UpdateEvent;

public record UpdateEventRequest(
    string Name,
    string Description,
    string Image,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    List<VoucherTypeDto> VoucherTypes,
    List<EventGameDto> Games,
    ItemDto? Item);
public record UpdateEventResponse();


public class UpdateEventEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/api/events/{eventId:guid}", async (
            [FromRoute] Guid eventId, 
            [FromBody] UpdateEventRequest request,
            [FromServices] ISender sender) =>
        {
            var command = new UpdateEventCommand(
                eventId,
                request.Name,
                request.Description,
                request.Image,
                request.StartTime,
                request.EndTime,
                request.VoucherTypes,
                request.Games,
                request.Item);

            var result = await sender.Send(command);

            return Results.NoContent();
        })
            .RequireAuthorization(AuthPolicy.BrandOrAdmin);
    }
}
