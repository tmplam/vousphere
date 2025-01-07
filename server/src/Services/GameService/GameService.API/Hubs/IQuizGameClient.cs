namespace GameService.API.Hubs;

public interface IQuizGameClient
{
    Task ReceiveEventInfo(string name, string description);
    Task ReceiveNumberOfPlayers(int numberOfPlayers);
    Task ReceiveQuestion(Guid eventId, Guid quizId, string content);
    Task ReceiveQuestionAnswer();
}