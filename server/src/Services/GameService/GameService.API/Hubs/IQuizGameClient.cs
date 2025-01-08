namespace GameService.API.Hubs;

public interface IQuizGameClient
{
    Task ReceiveEventInfo(string name, string description);
    Task ReceiveQuizNumberOfPlayers(int numberOfPlayers);
    Task ReceiveQuestion(Guid eventId, Guid quizId, string content);
    Task ReceiveQuestionAnswer();
}