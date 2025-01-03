using BuildingBlocks.Http.Dtos.Users;

namespace BuildingBlocks.Http.Dtos.Events;

public class FavoriteEventDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public Guid BrandId { get; set; }
    public BrandDto? Brand { get; set; }
}
