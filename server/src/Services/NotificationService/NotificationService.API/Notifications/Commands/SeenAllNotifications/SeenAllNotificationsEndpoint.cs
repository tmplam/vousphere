namespace NotificationService.API.Notifications.Commands.SeenAllNotifications;

public class SeenAllNotificationsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPatch("/api/notifications/seen-all", async (ISender sender) =>
        {
            var command = new SeenAllNotificationsCommand();
            await sender.Send(command);
            return Results.NoContent();
        });
    }
}
