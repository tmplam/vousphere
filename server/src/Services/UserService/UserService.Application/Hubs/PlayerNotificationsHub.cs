using BuildingBlocks.Auth.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
namespace UserService.Application.Hubs;

[Authorize(Policy = AuthPolicy.Player)]
public sealed class PlayerNotificationsHub : Hub
{
    public override Task OnConnectedAsync()
    {
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        return base.OnDisconnectedAsync(exception);
    }

    public Task SendMessage(string user, string message)
    {
        return Task.CompletedTask;
    }
}
