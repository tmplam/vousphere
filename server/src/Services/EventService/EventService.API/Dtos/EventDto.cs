using BuildingBlocks.Http.Dtos.Users;

namespace EventService.API.Dtos;

public class EventDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid ImageId { get; set; }
    public string Image { get; set; } = string.Empty;
    public EventStatus Status { get; set; } = EventStatus.Pending;
    public string? Comment { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset StartTime { get; set; }
    public DateTimeOffset EndTime { get; set; }
    public Guid BrandId { get; set; }
    public BrandDto? Brand { get; set; } = null;

    public List<VoucherType> VoucherTypes { get; set; } = new();
    public int TotalVouchers => VoucherTypes.Sum(voucherType => voucherType.Total);
    public int TotalPublishedVouchers => VoucherTypes.Sum(voucherType => voucherType.Total - voucherType.Remaining);

    public List<EventGame> Games { get; set; } = new();
    public ItemDto? Item { get; set; }
}
