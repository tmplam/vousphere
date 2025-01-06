using BuildingBlocks.Shared;
using Microsoft.AspNetCore.Mvc;

namespace NotificationService.API.Notifications.Queries.GetNotificationById;

public class GetNotificationByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/notifications/{notificationId:guid}", async (
            [FromRoute] Guid notificationId,
            [FromServices] ISender sender) =>
        {
            var query = new GetNotificationByIdQuery(notificationId);
            var result = await sender.Send(query);
            return Results.Ok(ApiResult.Success(result.Notification));
        })
            .RequireAuthorization();
    }
}
