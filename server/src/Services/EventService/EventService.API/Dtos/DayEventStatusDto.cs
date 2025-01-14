namespace EventService.API.Dtos;

public class DayEventStatusDto
{
    public DateTimeOffset Date { get; set; }
    public int NumberOfPendings { get; set; }
    public int NumberOfHappenings { get; set; }
    public int NumberOfEndeds { get; set; }
}
