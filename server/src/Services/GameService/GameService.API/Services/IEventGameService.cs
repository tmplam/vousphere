using BuildingBlocks.Http.Dtos.Events;

namespace GameService.API.Services;

public interface IEventGameService
{
    Task<InternalEventInfoDto?> GetEventInfoAsync(Guid eventId);
    Task<Quiz> GetQuizInfoAsync(Guid eventId, Guid quizId);
}
