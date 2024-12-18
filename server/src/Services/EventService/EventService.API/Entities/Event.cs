using EventService.API.Enums;

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

    public List<Voucher> Vouchers { get; set; } = new();
    public int TotalCodes => Vouchers.Sum(voucher => voucher.TotalCodes);
    public int TotalPublishedCodes => Vouchers.Sum(voucher => voucher.VoucherCodes.Count());

    public List<EventGame> Games { get; set; } = new();
    public Item? Item { get; set; }
}
