using BuildingBlocks.Http.Dtos.Events;
using Refit;

namespace BuildingBlocks.Http.InternalServiceApis;

public interface IEventApi
{
    [Post("/api/events/favorite-events")]
    Task<List<FavoriteEventDto>> GetFavoriteEventsAsync(params IEnumerable<Guid> eventIds);

    [Get("/api/events/{eventId}/exists")]
    Task<bool> CheckEventExistsAsync(Guid eventId);

    [Get("/api/events/{eventId}/internal-info")]
    Task<InternalEventInfoDto> GetInternalEventInfoAsync(Guid eventId);
}
