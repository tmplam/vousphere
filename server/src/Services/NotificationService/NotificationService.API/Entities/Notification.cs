using NotificationService.API.Enums;

namespace NotificationService.API.Entities;

public class Notification
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public NotificationType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public object? Data { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public bool IsSeen { get; set; }
}
