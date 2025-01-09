using BuildingBlocks.Http.Dtos.Events;
using GameService.API.Utilities;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace GameService.API.Services;


public class CachedEventGameService(
    IEventGameService _eventGameService,
    IDistributedCache _cache) : IEventGameService
{
    public async Task<InternalEventInfoDto?> GetEventInfoAsync(Guid eventId)
    {
        var cachedEventInfo = await _cache.GetStringAsync(RedisCacheKeys.EventInfoKey(eventId));

        if (!string.IsNullOrEmpty(cachedEventInfo))
            return JsonSerializer.Deserialize<InternalEventInfoDto>(cachedEventInfo)!;

        var eventInfo = await _eventGameService.GetEventInfoAsync(eventId);

        if (eventInfo == null)
            return null;

        await _cache.SetStringAsync(RedisCacheKeys.EventInfoKey(eventId), JsonSerializer.Serialize(eventInfo));

        return eventInfo;
    }

    public async Task<Quiz> GetQuizInfoAsync(Guid eventId, Guid quizId)
    {
        var cachedQuizInfo = await _cache.GetStringAsync(RedisCacheKeys.EventQuizInfoKey(eventId, quizId));

        if (!string.IsNullOrEmpty(cachedQuizInfo))
            return JsonSerializer.Deserialize<Quiz>(cachedQuizInfo)!;

        var quizInfo = await _eventGameService.GetQuizInfoAsync(eventId, quizId);

        await _cache.SetStringAsync(RedisCacheKeys.EventQuizInfoKey(eventId, quizId), JsonSerializer.Serialize(quizInfo));

        return quizInfo;
    }
}
