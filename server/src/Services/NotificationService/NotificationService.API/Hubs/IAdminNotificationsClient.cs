namespace NotificationService.API.Hubs;

public interface IAdminNotificationsClient
{
    Task ReceiveAdminNotification(
        string Type, 
        string Title, 
        string Message, 
        DateTimeOffset Time, 
        object? Data);
}
