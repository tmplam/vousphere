namespace EventService.API.Entities;

public class EventGame
{
    public Guid Id { get; set; }
    public Guid GameId { get; set; }
    public bool CanGetItem { get; set; }
    public Guid? QuizzCollectionId { get; set; } = null;
}
