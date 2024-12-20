namespace EventService.API.Entities;

public class ItemPiece
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public Guid EventId { get; set; }
    public Guid GameId { get; set; }
    public int PieceIndex { get; set; }
    public int Count { get; set; }
}
