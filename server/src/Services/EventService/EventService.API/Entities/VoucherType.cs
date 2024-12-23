namespace EventService.API.Entities;

public class VoucherType
{
    public Guid Id { get; set; }
    public double Discount { get; set; }
    public int Total { get; set; }
    public int Remaining { get; set; }
}
