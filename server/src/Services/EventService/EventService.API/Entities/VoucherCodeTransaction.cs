namespace EventService.API.Entities;

public class VoucherCodeTransaction
{
    public Guid Id { get; set; }
    public Guid SenderId { get; set; }
    public Guid ReceiverId { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public Guid VoucherId { get; set; }
    public string Code { get; set; } = string.Empty;
    public DateTimeOffset ExpiredTime { get; set; }
}
