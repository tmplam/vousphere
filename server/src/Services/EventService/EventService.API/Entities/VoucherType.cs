namespace EventService.API.Entities;

public class VoucherType
{
    public string Type { get; set; } = string.Empty; // 20%, 30%, ...
    public int Total { get; set; }
    public int Remaining { get; set; }
}
