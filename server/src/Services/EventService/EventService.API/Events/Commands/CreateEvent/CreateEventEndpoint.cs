namespace EventService.API.Events.Commands.CreateEvent;

public record CreateEventRequest(
    string Name,
    string Description,
    Guid ImageId,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    List<VoucherTypeDto> VoucherTypes,
    List<EventGameDto> Games,
    ItemDto? Item);

public record CreateEventResponse(Guid EventId);


public class CreateEventEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/events", async ([FromBody] CreateEventRequest request, [FromServices] ISender sender) =>
        {
            var command = request.Adapt<CreateEventCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<CreateEventResponse>();

            return Results.Created($"/events/{response.EventId}", ApiResult.Success(response, "Event created"));
        })
            .RequireAuthorization(AuthPolicy.BrandOrAdmin);
    }
}
