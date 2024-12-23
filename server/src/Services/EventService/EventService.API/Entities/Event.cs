namespace EventService.API.Entities;

public class Event
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Image { get; set; }
    public EventStatus Status { get; set; } = EventStatus.Pending;
    public string? Comment { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public Guid BrandId { get; set; }

    public List<VoucherType> VoucherTypes { get; set; } = new();
    public int TotalVouchers => VoucherTypes.Sum(voucherType => voucherType.Total);
    public int TotalPublishedVouchers => VoucherTypes.Sum(voucherType => voucherType.Total - voucherType.Remaining);

    public List<EventGame> Games { get; set; } = new();
    public Item? Item { get; set; }
}
