namespace VoucherService.API.Dtos;

public class GameReleasedVouchersDto
{
    public string GameId { get; set; } = string.Empty;
    public long TotalReleasedVouchers { get; set; }
}
