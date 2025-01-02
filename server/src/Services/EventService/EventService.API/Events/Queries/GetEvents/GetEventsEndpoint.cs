namespace EventService.API.Events.Queries.GetEvents;

public record GetEventsRequest(
    int Page = 1,
    int PerPage = 10,
    string Keyword = "");
public record GetEventsResponse(PaginationResult<EventDto> Events);


public class GetEventsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/events", async ([AsParameters] GetEventsRequest request, [FromServices] ISender sender) =>
        {
            var query = request.Adapt<GetEventsQuery>();

            var result = await sender.Send(query);

            var response = result.Adapt<GetEventsResponse>();

            return Results.Ok(ApiResult.Success(response.Events));
        });
    }
}
