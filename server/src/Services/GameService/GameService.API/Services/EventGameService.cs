using BuildingBlocks.Http.Dtos.Events;

namespace GameService.API.Services;


public class EventGameService(
    IDocumentSession _session,
    IEventApi _eventService) : IEventGameService
{
    public async Task<InternalEventInfoDto?> GetEventInfoAsync(Guid eventId)
    {
        var eventInfo = await _eventService.GetInternalEventInfoAsync(eventId);

        if (eventInfo is null || !eventInfo.Status.Equals("Happening", StringComparison.OrdinalIgnoreCase))
            return null;

        return eventInfo;
    }

    public async Task<Quiz> GetQuizInfoAsync(Guid eventId, Guid quizId)
    {
        return (await _session.LoadAsync<Quiz>(quizId))!;
    }
}
