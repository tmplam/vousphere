namespace NotificationService.API.Hubs;

public interface IBrandNotificationsClient
{
    Task ReceiveBrandNotification(Notification notification);
}
