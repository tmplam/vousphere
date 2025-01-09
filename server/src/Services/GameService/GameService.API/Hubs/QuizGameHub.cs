using BuildingBlocks.Shared.Constants;
using GameService.API.Entities;
using GameService.API.Services;
using GameService.API.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace GameService.API.Hubs;


[Authorize(Policy = AuthPolicy.Player)]
public class QuizGameHub(
    ILogger<QuizGameHub> _logger,
    IEventGameService _eventGameService,
    IDistributedCache _cache) : Hub<IQuizGameClient>
{
    public override async Task OnConnectedAsync()
    {
        var eventIdString = Context.GetHttpContext()?.Request.Query["eventId"];
        var quizIdString = Context.GetHttpContext()?.Request.Query["quizId"];

        if (Guid.TryParse(eventIdString, out var eventId) &&
            Guid.TryParse(quizIdString, out var quizId))
        {
            var eventGameInfo = await _eventGameService.GetEventInfoAsync(eventId);

            if (eventGameInfo == null ||
                !eventGameInfo.Games.Any(g => g.GameId == GameIdentifiers.QuizGameId))
            {
                Context.Abort();
                return;
            }

            var quizGame = eventGameInfo.Games.First(g => g.GameId == GameIdentifiers.QuizGameId);
            if (quizGame.StartTime == null)
            {
                Context.Abort();
                return;
            }

            var currentTime = DateTimeOffset.UtcNow;
            var minAllowTime = quizGame.StartTime.Value.Add(TimeSpan.FromMinutes(-10));
            var maxAllowTime = quizGame.StartTime.Value;
            if (currentTime < minAllowTime || currentTime > maxAllowTime)
            {
                Context.Abort();
                return;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, eventId.ToString());

            // Increment the number of players
            var numberOfPlayersKey = RedisCacheKeys.EventQuizNumberOfPlayersKey(eventId);
            var numberOfPlayersString = await _cache.GetStringAsync(numberOfPlayersKey);
            int numberOfPlayers = string.IsNullOrEmpty(numberOfPlayersString) ? 0 : int.Parse(numberOfPlayersString);
            numberOfPlayers++;
            await _cache.SetStringAsync(numberOfPlayersKey, numberOfPlayers.ToString());
            await Clients.Group(eventId.ToString()).ReceiveQuizNumberOfPlayers(numberOfPlayers);

            await base.OnConnectedAsync();
        }
        else
        {
            Context.Abort();
            return;
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var eventIdString = Context.GetHttpContext()?.Request.Query["eventId"];
        if (Guid.TryParse(eventIdString, out var eventId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, eventId.ToString());

            // Decrement the number of players
            var numberOfPlayersKey = RedisCacheKeys.EventQuizNumberOfPlayersKey(eventId);
            var numberOfPlayersString = await _cache.GetStringAsync(numberOfPlayersKey);
            int numberOfPlayers = string.IsNullOrEmpty(numberOfPlayersString) ? 0 : int.Parse(numberOfPlayersString);
            if (numberOfPlayers > 0)
                numberOfPlayers--;
            await _cache.SetStringAsync(numberOfPlayersKey, numberOfPlayers.ToString());
            await Clients.Group(eventId.ToString()).ReceiveQuizNumberOfPlayers(numberOfPlayers);

            await base.OnDisconnectedAsync(exception);
        }
    }

    public async Task SubmitAnswerAsync(string answer)
    {
        var eventIdString = Context.GetHttpContext()?.Request.Query["eventId"];
        var quizIdString = Context.GetHttpContext()?.Request.Query["quizId"];
        if (!Guid.TryParse(eventIdString, out var eventId) ||
            !Guid.TryParse(quizIdString, out var quizId))
        {
            _logger.LogWarning("User submited wrong eventId and quizId");           
            return;
        }

        var currentQuestionKey = RedisCacheKeys.CurrentQuizQuestionKey(eventId, quizId);
        var questionIndexString = await _cache.GetStringAsync(currentQuestionKey);
        if (string.IsNullOrEmpty(questionIndexString))
        {
            await Clients.Caller.ReceiveEventInfo("Error", "No active question.");
            return;
        }

        int questionIndex = int.Parse(questionIndexString);
        var quiz = await _eventGameService.GetQuizInfoAsync(eventId, quizId);
        if (quiz == null || questionIndex >= quiz.Questions.Count)
        {
            await Clients.Caller.ReceiveEventInfo("Error", "Invalid question.");
            return;
        }

        var question = quiz.Questions[questionIndex];

        // Check the answer and send the result to the client
        //bool isCorrect = question.CorrectAnswer == answer;
        //await Clients.Caller.ReceiveQuestionAnswer(isCorrect);
    }
}
