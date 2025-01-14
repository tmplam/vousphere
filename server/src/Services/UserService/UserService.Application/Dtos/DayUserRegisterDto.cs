namespace UserService.Application.Dtos;

public class DayUserRegisterDto
{
    public DateTimeOffset Date { get; set; }

    public int NumberOfBrands { get; set; }
    public int NumberOfPlayers { get; set; }
}
