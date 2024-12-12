using BuildingBlocks.Auth.Abstractions.Enums;

namespace BuildingBlocks.Auth.Abstractions;

public abstract class AuthUser
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? UserName { get; set; }
    public string? Email { get; set; }
    public string Phone { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Player;
}
