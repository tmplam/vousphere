namespace VoucherService.API.Entities;

public class ItemPiece
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public Guid EventId { get; set; }
    public Guid BrandId { get; set; }
    public string GameId { get; set; } = null!;
    public int PieceIndex { get; set; }
    public int Count { get; set; }
    public DateTimeOffset IssuedAt { get; set; } = DateTimeOffset.UtcNow;
}
