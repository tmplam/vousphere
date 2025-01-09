namespace GameService.API.Utilities;

public static class RedisCacheKeys
{
    public static string EventInfoKey(Guid eventId) => $"event:{eventId}";
    public static string EventQuizNumberOfPlayersKey(Guid eventId) => $"event:{eventId}:quizNumberOfPlayers";
    public static string EventQuizInfoKey(Guid eventId, Guid quizId) => $"event:{eventId}:quiz{quizId}";
    public static string CurrentQuizQuestionKey(Guid eventId, Guid quizId) => $"event:{eventId}:quiz:{quizId}:currentQuestion";
}
