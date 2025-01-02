namespace EventService.API.Dtos;

public class FavoriteEventDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid ImageId { get; set; }
    public string Image { get; set; } = string.Empty;
    public EventStatus Status { get; set; } = EventStatus.Pending;
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public Guid BrandId { get; set; }
}
