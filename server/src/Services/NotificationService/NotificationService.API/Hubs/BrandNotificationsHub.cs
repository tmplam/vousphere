using BuildingBlocks.Auth.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace NotificationService.API.Hubs;


[Authorize(Policy = AuthPolicy.Brand)]
public class BrandNotificationsHub : Hub<IBrandNotificationsClient>
{
}
