using EventService.API.Enums;

namespace EventService.API.Entities;

public class Voucher
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public Guid EventId { get; set; }
    public Guid GameId { get; set; }
    public string Type { get; set; } = string.Empty; // 20%, 30%, ...
    public string Code { get; set; } = string.Empty;
    public VoucherStatus Status { get; set; } = VoucherStatus.Active;
    public DateTimeOffset IssuedAt { get; set; }
    public DateTimeOffset ExpiredAt { get; set; }
}
