using BuildingBlocks.Auth.Constants;
using Microsoft.AspNetCore.Authorization;

namespace NotificationService.API.Hubs;


[Authorize(Policy = AuthPolicy.Admin)]
public class AdminNotificationsHub : Hub<IAdminNotificationsClient>
{
    override public async Task OnConnectedAsync()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, AuthPolicy.Admin);
        await base.OnConnectedAsync();
    }

    override public async Task OnDisconnectedAsync(Exception? exception)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, AuthPolicy.Admin);
        await base.OnDisconnectedAsync(exception);
    }
}
