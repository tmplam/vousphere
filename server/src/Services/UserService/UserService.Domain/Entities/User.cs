using UserService.Domain.Enums;
using BuildingBlocks.Auth;

namespace UserService.Domain.Entities;

public class User : AuthUser
{
    public UserStatus Status { get; set; } = UserStatus.Created;
    public Guid? ImageId { get; set; } = null;

    public Player? Player { get; set; }
    public Brand? Brand { get; set; }
    public ICollection<UserFavorite>? UserFavorites { get; set; }
    public ICollection<Otp>? Otps { get; set; }
}
