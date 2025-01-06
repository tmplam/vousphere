namespace NotificationService.API.Hubs;

public interface IAdminNotificationsClient
{
    Task ReceiveAdminNotification(Notification notification);
}
