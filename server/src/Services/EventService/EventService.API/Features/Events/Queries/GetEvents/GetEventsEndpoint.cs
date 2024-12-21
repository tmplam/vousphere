namespace EventService.API.Features.Events.Queries.GetEvents;

public record GetEventsRequest();
public record GetEventsResponse();


public class GetEventsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/events", () =>
        {

        });
    }
}
