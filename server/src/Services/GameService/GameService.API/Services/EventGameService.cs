using BuildingBlocks.Http.Dtos.Events;

namespace GameService.API.Services;

public class EventGameService(IEventApi _eventService) : IEventGameService
{
    public async Task<InternalEventInfoDto?> GetEventInfoAsync(Guid eventId)
    {
        var eventInfo = await _eventService.GetInternalEventInfoAsync(eventId);

        if (eventInfo is null || !eventInfo.Status.Equals("Happening", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        return eventInfo;
    }
}
