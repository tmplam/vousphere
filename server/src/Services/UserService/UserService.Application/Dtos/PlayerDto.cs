namespace UserService.Application.Dtos;

public class PlayerDto
{
    public Guid UserId { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? Gender { get; set; } = string.Empty;
    public int NumberOfPlays { get; set; }
}
