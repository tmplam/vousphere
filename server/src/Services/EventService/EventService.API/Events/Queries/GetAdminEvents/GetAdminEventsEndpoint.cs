namespace EventService.API.Events.Queries.GetAdminEvents;

public record GetAdminEventsRequest(
    int Page = 1,
    int PerPage = 10,
    string Keyword = "",
    DateTimeOffset? StartTime = null,
    DateTimeOffset? EndTime = null,
    EventStatus? Status = null);
public record GetAdminEventsResponse(PaginationResult<EventDto> Events);

public class GetAdminEventsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/admin/events", async (
            [AsParameters] GetAdminEventsRequest request, 
            [FromServices] ISender sender) =>
        {
            var query = request.Adapt<GetAdminEventsQuery>();

            var result = await sender.Send(query);

            var response = result.Adapt<GetAdminEventsResponse>();

            return Results.Ok(ApiResult.Success(response.Events));
        })
            .RequireAuthorization(AuthPolicy.Admin);
    }
}
