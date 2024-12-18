namespace EventService.API.Entities;

public class ItemPieceTransaction
{
    public Guid Id { get; set; }
    public Guid SenderId { get; set; }
    public Guid ReceiverId { get; set; }
    public Guid ItemId { get; set; }
    public int PieceIndex { get; set; }
    public int Count { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}
