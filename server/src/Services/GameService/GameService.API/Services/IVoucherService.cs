namespace GameService.API.Services;

public interface IVoucherService
{
    Task<GeneratedVoucher> DistributeVoucherAsync(Guid eventId, string gameId, Guid userId);
    Task<List<GeneratedVoucher>> DistributeVoucherListAsync(Guid eventId, int quantity, string gameId);
}
