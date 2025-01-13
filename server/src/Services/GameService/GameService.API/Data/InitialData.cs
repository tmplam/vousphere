using BuildingBlocks.Shared.Constants;
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
            ImageId = Guid.Parse("765bed7e-710f-450e-a3dc-ea31e0fc9048"),
        },
        new Game()
        {
            Id = GameIdentifiers.QuizGameId,
            Name = "Trivia Challenge",
            Description = "Put your knowledge to the test in this live, interactive trivia game! Compete with others in real time and win exclusive vouchers.",
            Type = GameType.Quiz,
            ImageId = Guid.Parse("88f9ad06-d541-4d02-9af6-83862c24d3d0"),
        }
    };
}
