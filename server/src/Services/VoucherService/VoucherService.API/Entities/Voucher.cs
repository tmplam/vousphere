using VoucherService.API.Enums;

namespace VoucherService.API.Entities;

public class Voucher
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public Guid EventId { get; set; }
    public string GameId { get; set; } = string.Empty;
    public double Discount { get; set; }
    public string Code { get; set; } = string.Empty;
    public VoucherStatus Status { get; set; } = VoucherStatus.Active;
    public DateTimeOffset IssuedAt { get; set; }
    public DateTimeOffset ExpiredAt { get; set; }
}
