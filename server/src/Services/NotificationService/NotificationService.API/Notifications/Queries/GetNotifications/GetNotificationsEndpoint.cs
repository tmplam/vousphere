using BuildingBlocks.Shared;
using Microsoft.AspNetCore.Mvc;

namespace NotificationService.API.Notifications.Queries.GetNotifications;

public record GetNotificationsRequest(int Page = 1, int PerPage = 5);

public class GetNotificationsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/notifications", async (
            [AsParameters] GetNotificationsRequest request,
            [FromServices] ISender sender) =>
        {
            var query = request.Adapt<GetNotificationsQuery>();
            var result = await sender.Send(query);

            return Results.Ok(ApiResult.Success(result.Notifications));
        })
            .RequireAuthorization();
    }
}
