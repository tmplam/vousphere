using Microsoft.AspNetCore.Mvc;
using NotificationService.API.Notifications.Commands.ToggleSeenNotification;

namespace NotificationService.API.Notifications.Commands.MarkAsSeen;

public class ToggleSeenNotificationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPatch("/api/notifications/{notificationId:guid}/toggle-seen", async (
            [FromRoute] Guid notificationId,
            [FromServices] ISender sender) =>
        {
            var command = new ToggleSeenNotificationCommand(notificationId);
            await sender.Send(command);
            return Results.NoContent();
        })
            .RequireAuthorization();
    }
}
