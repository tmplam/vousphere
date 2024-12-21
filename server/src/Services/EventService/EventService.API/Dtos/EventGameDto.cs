namespace EventService.API.Dtos;

public class EventGameDto
{
    public Guid GameId { get; set; }
    public bool PopUpItemsEnabled { get; set; } = false;
    public Guid? QuizzCollectionId { get; set; } = null;
}
