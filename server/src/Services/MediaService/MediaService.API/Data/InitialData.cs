using Marten.Schema;

namespace MediaService.API.Data;

public class InitialData : IInitialData
{
    public async Task Populate(IDocumentStore store, CancellationToken cancellation)
    {
        using var session = store.LightweightSession();
        if (await session.Query<Media>().AnyAsync())
            return;
        session.Store(GetPreconfiguredMedias());
        await session.SaveChangesAsync();
    }
    private static IEnumerable<Media> GetPreconfiguredMedias() => new List<Media>()
    {
        // Shaking game
        new()
        {
            Id = Guid.Parse("765bed7e-710f-450e-a3dc-ea31e0fc9048"),
            Url = "https://vouspherestorageaccount.blob.core.windows.net/images/0f57bafb-4200-4bd6-9663-39572e0617d7",
            Status = MediaStatus.Published,
            UploadedAt = DateTimeOffset.Parse("01/01/2024 2:30:00 PM +00:00")
        },
        // Quiz game
        new()
        {
            Id = Guid.Parse("88f9ad06-d541-4d02-9af6-83862c24d3d0"),
            Url = "https://vouspherestorageaccount.blob.core.windows.net/images/2481f49f-36c8-458e-8db8-33a1ab8b9273",
            Status = MediaStatus.Published,
            UploadedAt = DateTimeOffset.Parse("01/01/2024 2:30:00 PM +00:00")
        },
        // Mixue
        new()
        {
            Id = Guid.Parse("8352f82d-7abe-42bc-84cd-9ee0f440b218"),
            Url = "https://vouspherestorageaccount.blob.core.windows.net/images/4af6b9ea-447c-4292-81a4-92a3d9c0ec9d",
            Status = MediaStatus.Published,
            UploadedAt = DateTimeOffset.Parse("01/01/2024 2:30:00 PM +00:00")
        },
        // Phuc long
        new()
        {
            Id = Guid.Parse("2fa35a3a-8f70-45a5-b4ea-5d3515efd778"),
            Url = "https://vouspherestorageaccount.blob.core.windows.net/images/2cfe8e88-ab6b-4a35-85ff-362f7a62e254",
            Status = MediaStatus.Published,
            UploadedAt = DateTimeOffset.Parse("01/01/2024 2:30:00 PM +00:00")
        },
        // Toco Toco
        new()
        {
            Id = Guid.Parse("8c10c679-be90-4f33-977b-26eb9b3deffd"),
            Url = "https://vouspherestorageaccount.blob.core.windows.net/images/3f4b3deb-928f-423a-a3f4-45953041c743",
            Status = MediaStatus.Published,
            UploadedAt = DateTimeOffset.Parse("01/01/2024 2:30:00 PM +00:00")
        },
        // Halidao
        new()
        {
            Id = Guid.Parse("5010f869-0b73-4870-bdc0-f25a81ad3483"),
            Url = "https://vouspherestorageaccount.blob.core.windows.net/images/3c5ea1ce-c195-45fb-bff9-6443e79dbcb4",
            Status = MediaStatus.Published,
            UploadedAt = DateTimeOffset.Parse("01/01/2024 2:30:00 PM +00:00")
        },
        // Bobapop
        new()
        {
            Id = Guid.Parse("be3220d5-bb24-4b82-8763-164415bd1834"),
            Url = "https://vouspherestorageaccount.blob.core.windows.net/images/bb0fa011-3b72-4509-b1c6-169c9032172f",
            Status = MediaStatus.Published,
            UploadedAt = DateTimeOffset.Parse("01/01/2024 2:30:00 PM +00:00")
        },
        // Flash Sale 2025
        new()
        {
            Id = Guid.Parse("8b56a542-9baa-4da9-8780-0ca0e6faab81"),
            Url = "https://vouspherestorageaccount.blob.core.windows.net/images/0fd3894f-4ed6-4781-8cb3-7d0aa18c779e",
            Status = MediaStatus.Published,
            UploadedAt = DateTimeOffset.Parse("01/01/2024 2:30:00 PM +00:00")
        },
    };
}