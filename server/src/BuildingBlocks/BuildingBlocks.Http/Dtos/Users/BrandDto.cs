namespace BuildingBlocks.Http.Dtos.Users;

public class BrandDto
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string Address { get; set; } = string.Empty;
    public string Domain { get; set; } = string.Empty;
}
