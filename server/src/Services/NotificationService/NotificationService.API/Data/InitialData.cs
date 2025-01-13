using Marten.Schema;

namespace NotificationService.API.Data;

public class InitialData : IInitialData
{
    public async Task Populate(IDocumentStore store, CancellationToken cancellation)
    {
        using var session = store.LightweightSession();
        if (await session.Query<Notification>().AnyAsync())
            return;
        session.Store(GetPreconfiguredNotifications());
        await session.SaveChangesAsync();
    }

    private static IEnumerable<Notification> GetPreconfiguredNotifications() => new List<Notification>()
    {
        new Notification()
        {

        }
    };
}
