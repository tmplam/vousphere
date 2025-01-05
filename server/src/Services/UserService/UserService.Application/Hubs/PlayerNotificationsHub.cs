﻿using BuildingBlocks.Auth.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
namespace UserService.Application.Hubs;

[Authorize(Policy = AuthPolicy.Player)]
public sealed class PlayerNotificationsHub : Hub<IPlayerNotificationsClient>
{
    public Task SendMessage(string user, string message)
    {
        return Task.CompletedTask;
    }
}
