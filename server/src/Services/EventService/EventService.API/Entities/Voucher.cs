namespace EventService.API.Entities;

public class Voucher
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Image { get; set; }
    public double Discount { get; set; }
    public int TotalCodes { get; set; }

    public List<VoucherCode> VoucherCodes { get; set; } = new();
}
