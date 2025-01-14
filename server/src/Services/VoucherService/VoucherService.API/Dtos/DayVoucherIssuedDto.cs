namespace VoucherService.API.Dtos;

public class DayVoucherIssuedDto
{
    public DateTimeOffset Date { get; set; }
    public long IssuedVouchers { get; set; }
}
