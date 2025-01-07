using GameService.API.Enums;

namespace GameService.API.Entities;

public class Game
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public GameType Type { get; set; }
    public Guid ImageId { get; set; }
}
