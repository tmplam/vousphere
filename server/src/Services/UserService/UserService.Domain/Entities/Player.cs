namespace UserService.Domain.Entities;

public class Player
{
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public string? Avatar { get; set; } = string.Empty;
    public DateOnly? DateOfBirth { get; set; }
    public string? Gender { get; set; } = string.Empty;
}
