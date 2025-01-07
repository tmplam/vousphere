namespace EventService.API.Dtos;

public class EventGameDto
{
    public string GameId { get; set; } = string.Empty;
    public bool PopUpItemsEnabled { get; set; } = false;
    public DateTimeOffset? StartTime { get; set; } = null;
    public Guid? QuizzCollectionId { get; set; } = null;
}