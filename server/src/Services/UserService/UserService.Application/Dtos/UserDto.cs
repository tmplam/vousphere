using BuildingBlocks.Auth.Enums;
using UserService.Domain.Enums;

namespace UserService.Application.Dtos;

public class UserDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public UserStatus Status { get; set; }
    public Guid ImageId { get; set; }
    public string? Image { get; set; } = null;
    public BrandDto? Brand { get; set; }
}
