using UserService.Domain.Enums;
using BuildingBlocks.Auth;

namespace UserService.Domain.Entities;

public class User : AuthUser
{
    public UserStatus Status { get; set; } = UserStatus.Active;

    public Player? Player { get; set; }
    public Brand? Brand { get; set; }
    public ICollection<UserFavorite>? UserFavorites { get; set; }
}
