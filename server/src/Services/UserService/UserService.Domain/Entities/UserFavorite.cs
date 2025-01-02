namespace UserService.Domain.Entities;

public class UserFavorite
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public Guid EventId { get; set; }
}
