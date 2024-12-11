using UserService.Domain.Primitives;
using UserService.Domain.Enums;

namespace UserService.Domain.Entities;

public class User : Entity
{
    public string? Name { get; set; } = string.Empty;
    public string? UserName { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public UserStatus Status { get; set; } = UserStatus.Active;
    public UserRole Role { get; set; } = UserRole.Player;

    public Player? Player { get; set; }
    public Brand? Brand { get; set; }
}
