using Microsoft.AspNetCore.Mvc;

namespace NotificationService.API.Notifications.Commands.DeleteNotification;

public class DeleteNotificationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/notifications/{notificationId:guid}", async (
            [FromRoute] Guid notificationId,
            [FromServices] ISender sender) =>
        {
            var command = new DeleteNotificationCommand(notificationId);
            await sender.Send(command);
            return Results.NoContent();
        })
            .RequireAuthorization();
    }
}
