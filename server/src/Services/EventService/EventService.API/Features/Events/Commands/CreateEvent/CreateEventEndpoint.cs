using BuildingBlocks.Shared;
using EventService.API.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace EventService.API.Features.Events.Commands.CreateEvent;


public record CreateEventRequest(
    string Name,
    string Image,
    string Description,
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
        app.MapPost("/events", async ([FromBody] CreateEventRequest request, [FromServices] ISender sender) =>
        {
            var command = request.Adapt<CreateEventCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<CreateEventResponse>();

            return Results.Ok(ApiResult.Success(response, "Event created"));
        })
            .RequireAuthorization();
    }
}
