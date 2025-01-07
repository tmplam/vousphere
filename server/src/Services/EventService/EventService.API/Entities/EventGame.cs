namespace EventService.API.Entities;

public class EventGame
{
    public string GameId { get; set; } = string.Empty;
    public bool PopUpItemsEnabled { get; set; } = false;
    public Guid? QuizzCollectionId { get; set; } = null;
}
