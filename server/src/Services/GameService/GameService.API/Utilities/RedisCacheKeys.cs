namespace GameService.API.Utilities;

public static class RedisCacheKeys
{
    public static string EventInfoKey(Guid eventId) => $"event:{eventId}";
    public static string EventQuizInfoKey(Guid eventId) => $"event:{eventId}:quiz";
    public static string EventQuizNumberOfPlayersKey(Guid eventId) => $"event:{eventId}:quiz:numberOfPlayers";
    public static string EventQuizScoresKey(Guid eventId) => $"event:{eventId}:quiz:scores";
    public static string CurrentQuizQuestionKey(Guid eventId) => $"event:{eventId}:quiz:currentQuestion";
}
