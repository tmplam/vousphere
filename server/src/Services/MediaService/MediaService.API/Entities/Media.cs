namespace MediaService.API.Entities;

public class Media
{
    public Guid Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public MediaStatus Status { get; set; } = MediaStatus.Draft;
    public DateTimeOffset UploadedAt { get; set; } = DateTimeOffset.UtcNow;
}
