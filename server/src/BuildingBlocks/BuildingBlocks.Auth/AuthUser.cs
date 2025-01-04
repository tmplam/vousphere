using BuildingBlocks.Auth.Enums;

namespace BuildingBlocks.Auth;

public class AuthUser
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? UserName { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Player;
}
