using Marten.Schema;

namespace VoucherService.API.Data;

public class InitialData : IInitialData
{
    public async Task Populate(IDocumentStore store, CancellationToken cancellation)
    {
        using var session = store.LightweightSession();
        if (!await session.Query<Voucher>().AnyAsync())
            session.Store(GetPreconfiguredVouchers());

        if (!await session.Query<ItemPiece>().AnyAsync())
            session.Store(GetPreconfiguredItemPieces());

        await session.SaveChangesAsync();
    }

    private static IEnumerable<Voucher> GetPreconfiguredVouchers() => new List<Voucher>()
    {
        new Voucher()
        {
            Id = Guid.Parse("e5ac3e33-d0c0-469a-b488-18c5fe908cdb"),
            Discount = 10,
        }
    };

    private static IEnumerable<ItemPiece> GetPreconfiguredItemPieces() => new List<ItemPiece>()
    {
        new ItemPiece()
        {
            Id = Guid.Parse("e5ac3e33-d0c0-469a-b488-18c5fe908cdb"),
        }
    };
}
