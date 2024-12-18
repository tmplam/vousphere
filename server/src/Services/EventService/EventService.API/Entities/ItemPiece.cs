namespace EventService.API.Entities;

public class ItemPiece
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public int PieceIndex { get; set; }
    public int Count { get; set; }
}
