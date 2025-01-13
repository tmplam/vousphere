using BuildingBlocks.Shared.Constants;
using Marten.Schema;

namespace EventService.API.Data;

public class InitialData : IInitialData
{
    public async Task Populate(IDocumentStore store, CancellationToken cancellation)
    {
        using var session = store.LightweightSession();

        if (await session.Query<Event>().AnyAsync())
            return;

        session.Store(GetPreconfiguredEvents());
        await session.SaveChangesAsync();
    }

    private static IEnumerable<Event> GetPreconfiguredEvents() => new List<Event>()
    {
        new Event()
        {
            Id = Guid.Parse("23ffd0e0-5b55-4330-b741-ce9c4eee8b37"),
            Name = "Sale End Year 2024",
            Description = "Get ready for the hottest deals of the season! Shop now and save big on your favorite brands.",
            ImageId = Guid.Parse("8b56a542-9baa-4da9-8780-0ca0e6faab81"),
            CreatedAt = DateTimeOffset.Parse("12/01/2024 2:30:00 PM +00:00"),
            StartTime = DateTimeOffset.Parse("12/15/2024 2:30:00 PM +00:00"),
            EndTime = DateTimeOffset.Parse("12/30/2024 2:30:00 PM +00:00"),
            BrandId = Guid.Parse("c06f7346-a6d3-434f-82c8-7085cde815d4"),
            Status = EventStatus.Ended,
            VoucherTypes = new List<VoucherType>()
            {
                new()
                {
                    Id = Guid.Parse("e5ac3e33-d0c0-469a-b488-18c5fe908cdb"),
                    Discount = 10,
                    Total = 50,
                    Remaining = 20
                },
                new()
                {
                    Id = Guid.Parse("3a33ce1b-a396-4cef-9bcc-b5a234ec9a5f"),
                    Discount = 20,
                    Total = 50,
                    Remaining = 10
                }
            },
            Games = new List<EventGame>()
            {
                new()
                {
                    GameId = GameIdentifiers.ShakingGameId,
                    PopUpItemsEnabled = false,
                }
            },
        },
        new Event()
        {
            Id = Guid.Parse("0e6a2005-a15d-4146-9251-6a6646280f9a"),
            Name = "New year sales 2025",
            Description = "Get ready for the hottest deals of the season! Shop now and save big on your favorite brands.",
            ImageId = Guid.Parse("8b56a542-9baa-4da9-8780-0ca0e6faab81"),
            CreatedAt = DateTimeOffset.Parse("01/01/2024 2:30:00 PM +00:00"),
            StartTime = DateTimeOffset.Parse("01/02/2024 2:30:00 PM +00:00"),
            EndTime = DateTimeOffset.Parse("01/15/2024 2:30:00 PM +00:00"),
            BrandId = Guid.Parse("c06f7346-a6d3-434f-82c8-7085cde815d4"),
            Status = EventStatus.Ended,
            VoucherTypes = new List<VoucherType>()
            {
                new()
                {
                    Id = Guid.Parse("e5ac3e33-d0c0-469a-b488-18c5fe908cdb"),
                    Discount = 10,
                    Total = 50,
                    Remaining = 50
                },
                new()
                {
                    Id = Guid.Parse("3a33ce1b-a396-4cef-9bcc-b5a234ec9a5f"),
                    Discount = 20,
                    Total = 50,
                    Remaining = 50
                }
            },
            Games = new List<EventGame>()
            {
                new()
                {
                    GameId = GameIdentifiers.ShakingGameId,
                    PopUpItemsEnabled = false,
                }
            },
        },
    };
}
