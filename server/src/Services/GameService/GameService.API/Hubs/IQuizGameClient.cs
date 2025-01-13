namespace GameService.API.Hubs;

public interface IQuizGameClient
{
    Task ReceiveQuizInfo(QuizInfoDto quiz);
    Task ReceiveQuizCountdown(int seconds);
    Task ReceiveQuestion(int questionIndex);
    Task ReceiveNewPlayerJoined(string playerId, string playerName);
    Task ReceivePlayerLeft(string playerId);
    Task ReceiveQuestionAnswer(int questionIndex, int correctOptionIndex);
    Task ReceiveAnswerScore(QuizAnswerScoreDto score);
    Task ReceiveQuizResult(double? discount = 0, int? pieceIndex = -1);
}
