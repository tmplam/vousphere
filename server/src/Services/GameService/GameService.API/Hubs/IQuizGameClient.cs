namespace GameService.API.Hubs;

public interface IQuizGameClient
{
    Task ReceiveQuizCountdown(int seconds);
    Task ReceiveQuizInfo(QuizInfoDto quiz);
    Task ReceiveQuizNumberOfPlayers(long numberOfPlayers);
    Task ReceiveQuestion(int questionIndex);
    Task ReceiveQuestionAnswer(int questionIndex, int correctOptionIndex);
    Task ReceiveAnswerScore(QuizAnswerScoreDto score);
    Task ReceiveQuizResult(double? discount = 0, int? pieceIndex = -1);
}
