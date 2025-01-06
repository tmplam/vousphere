namespace NotificationService.API.Hubs;

public interface IPlayerNotificationsClient
{
    Task ReceivePlayerNotification(Notification notification);
}
