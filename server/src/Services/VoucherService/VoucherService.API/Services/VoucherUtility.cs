namespace VoucherService.API.Services;

public class VoucherUtility : IVoucherUtility
{
    public string GenerateVoucherCode()
    {
        string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        return new string(Enumerable.Repeat(chars, 10)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }
}
