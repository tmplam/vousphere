namespace EventService.API.Features.Events.Queries.GetEventById;

public record GetEventByIdResponse(EventDto Event);


public class GetEventByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/events/{eventId:guid}", async (
            [FromRoute] Guid eventId, 
            [FromServices] ISender sender) =>
        {
            var query = new GetEventByIdQuery(eventId);

            var result = await sender.Send(query);

            var response = result.Adapt<GetEventByIdResponse>();

            return Results.Ok(ApiResult.Success(response.Event));
        });
    }
}
