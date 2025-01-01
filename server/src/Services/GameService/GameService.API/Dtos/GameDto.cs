namespace GameService.API.Dtos;

public class GameDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid ImageId { get; set; }
    public string Image { get; set; } = string.Empty;
}
