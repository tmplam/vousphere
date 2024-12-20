namespace EventService.API.Dtos;

public class VoucherDto
{
    public string Name { get; set; } = string.Empty;
    public double Discount { get; set; }
    public int TotalCodes { get; set; }
}
