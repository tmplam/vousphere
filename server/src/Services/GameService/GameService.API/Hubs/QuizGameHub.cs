using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace GameService.API.Hubs;

[Authorize(Policy = AuthPolicy.Player)]
public class QuizGameHub : Hub<IQuizGameClient>
{
    public override async Task OnConnectedAsync()
    {
        var eventIdString = Context.GetHttpContext()?.Request.Query["eventId"];
        if (Guid.TryParse(eventIdString, out var eventId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, eventId.ToString());
            await base.OnConnectedAsync();
        }
        else
            Context.Abort();
    }


    public async Task SendQuestion(Guid quizId, string question)
    {
        //await Clients.Group(quizId.ToString()).SendAsync("ReceiveQuestion", question);
    }

    public async Task SubmitAnswer(Guid quizId, Guid userId, string answer)
    {
        //await Clients.Group(quizId.ToString()).SendAsync("ReceiveAnswer", userId, answer);
    }

    public async Task JoinQuiz(Guid eventId, Guid quizId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, quizId.ToString());
    }

    public async Task LeaveQuiz(Guid quizId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, quizId.ToString());
    }
}