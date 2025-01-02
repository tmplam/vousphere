namespace BuildingBlocks.Http.Dtos.Events;

public class BrandDto
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Domain { get; set; } = string.Empty;
}
