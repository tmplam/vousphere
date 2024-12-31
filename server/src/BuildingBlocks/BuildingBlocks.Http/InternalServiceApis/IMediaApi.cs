using Refit;

namespace BuildingBlocks.Http.InternalServiceApis;

public interface IMediaApi
{
    [Post("/api/medias/image-urls")]
    Task<Dictionary<Guid, string>> GetImageUrlsAsync(IEnumerable<Guid> imageIds);

    [Get("/api/medias/{imageId}/image-url")]
    Task<string> GetImageUrlAsync(Guid imageId);
}
