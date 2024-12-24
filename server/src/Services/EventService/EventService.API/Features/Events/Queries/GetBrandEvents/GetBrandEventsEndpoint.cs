namespace EventService.API.Features.Events.Queries.GetBrandEvents;

public record GetBrandEventsRequest(
    int Page = 1,
    int PerPage = 10,
    string Keyword = "",
    DateTimeOffset? StartTime = null,
    DateTimeOffset? EndTime = null,
    EventStatus? Status = null);
public record GetBrandEventsResponse(PaginationResult<Event> Events);


public class GetBrandEventsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/brand/events", async ([AsParameters] GetBrandEventsRequest request, [FromServices] ISender sender) =>
        {

            var query = request.Adapt<GetBrandEventsQuery>();

            var result = await sender.Send(query);

            var response = result.Adapt<GetBrandEventsResponse>();

            return Results.Ok(ApiResult.Success(response.Events));
        })
            .RequireAuthorization(AuthPolicy.BrandOrAdmin);
    }
}
