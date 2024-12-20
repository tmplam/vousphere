using Marten.Schema;

namespace GameService.API.Data;

public class InitialData : IInitialData
{
    public async Task Populate(IDocumentStore store, CancellationToken cancellation)
    {
        using var session = store.LightweightSession();

        if (await session.Query<Game>().AnyAsync())
            return;

        session.Store(GetPreconfiguredGames());
        await session.SaveChangesAsync();
    }

    private static IEnumerable<Game> GetPreconfiguredGames() => new List<Game>()
        {
            new Game()
            {
                Id = new Guid("5334c996-8457-4cf0-815c-ed2b77c4ff61"),
                Name = "Shake It Up",
                Description = "Shake your phone to unlock exciting rewards! The faster and harder you shake, the closer you get to amazing vouchers.",
                Image = "",
            },
            new Game()
            {
                Id = new Guid("c67d6323-e8b1-4bdf-9a75-b0d0d2e7e914"),
                Name = "Trivia Challenge",
                Description = "Put your knowledge to the test in this live, interactive trivia game! Compete with others in real time and win exclusive vouchers.",
                Image = "",
            }
        };
}
