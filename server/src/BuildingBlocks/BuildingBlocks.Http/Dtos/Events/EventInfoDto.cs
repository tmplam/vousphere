namespace BuildingBlocks.Http.Dtos.Events;

public class EventInfoDto
{
    public Guid Id { get; set; }
    public Guid BrandId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public ItemInfoDto? Item { get; set; }
}
