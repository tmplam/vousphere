namespace GameService.API.Hubs;

public interface IQuizGameClient
{
    Task ReceiveQuizCountdown(int seconds);
    Task ReceiveQuizInfo(QuizInfoDto quiz);
    Task ReceiveNewPlayerJoined(string playerId, string playerName);
    Task ReceivePlayerLeft(string playerId);
    Task ReceiveQuestion(int questionIndex);
    Task ReceiveQuestionAnswer(int questionIndex, int correctOptionIndex);
    Task ReceiveAnswerScore(QuizAnswerScoreDto score);
    Task ReceiveQuizResult(double? discount = 0, int? pieceIndex = -1);
}
