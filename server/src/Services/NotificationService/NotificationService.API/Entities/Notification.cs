namespace NotificationService.API.Entities;

public class Notification
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; } = Guid.Empty; // Empty is admin's notification
    public NotificationType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public Dictionary<string, object>? Data { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public bool IsSeen { get; set; } = false;
}
