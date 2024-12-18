using EventService.API.Enums;

namespace EventService.API.Entities;

public class VoucherCode
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public Guid OwnedBy { get; set; }
    public Guid GameId { get; set; }
    public DateTimeOffset ExpiredTime { get; set; }
    public VoucherCodeStatus Status { get; set; } = VoucherCodeStatus.Active;
}
