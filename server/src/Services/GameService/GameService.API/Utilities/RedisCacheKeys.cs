namespace GameService.API.Utilities;

public static class RedisCacheKeys
{
    public static string EventInfoKey(Guid eventId) => $"Event:{eventId}";
    public static string EventQuizNumberOfPlayersKey(Guid eventId) => $"Event:{eventId}:QuizNumberOfPlayers";
}
