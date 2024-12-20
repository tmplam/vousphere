using VoucherService.API.Enums;

namespace EventService.API.Entities;

public class Transaction
{
    public Guid Id { get; set; }
    public TransactionType Type { get; set; }
    public Guid EventId { get; set; }
    public Guid? VoucherId { get; set; } = null;
    public Guid? ItemPieceId { get; set; } = null;
    public Guid SenderId { get; set; }
    public Guid RecipientId { get; set; }
    public int Quantity { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}
