using GameService.API.Constants;
using GameService.API.Enums;
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
                Id = GameIdentifiers.ShakingGameId,
                Name = "Shake It Up",
                Description = "Shake your phone to unlock exciting rewards! The faster and harder you shake, the closer you get to amazing vouchers.",
                Type = GameType.Shaking,
                ImageId = Guid.Parse("44a04ff0-e1b3-4e2e-94e8-8ee4c8bb5c11"),
            },
            new Game()
            {
                Id = GameIdentifiers.QuizGameId,
                Name = "Trivia Challenge",
                Description = "Put your knowledge to the test in this live, interactive trivia game! Compete with others in real time and win exclusive vouchers.",
                Type = GameType.Quiz,
                ImageId = Guid.Parse("341f2d8f-c422-4f33-9a11-5a657d31e16a"),
            }
        };
}
