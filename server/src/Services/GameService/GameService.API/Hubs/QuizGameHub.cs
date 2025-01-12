using BuildingBlocks.Shared.Constants;
using GameService.API.Services;
using GameService.API.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using StackExchange.Redis;
using System.Text.Json;

namespace GameService.API.Hubs;


[Authorize(Policy = AuthPolicy.Player)]
public class QuizGameHub(
    ILogger<QuizGameHub> _logger,
    IEventGameService _eventGameService,
    IDistributedCache _cache,
    IConnectionMultiplexer _redisConnection) : Hub<IQuizGameClient>
{
    public override async Task OnConnectedAsync()
    {
        var eventIdString = Context.GetHttpContext()?.Request.Query["eventId"];

        if (Guid.TryParse(eventIdString, out var eventId))
        {
            var eventGameInfo = await _eventGameService.GetEventInfoAsync(eventId);
            
            if (eventGameInfo == null ||
                !eventGameInfo.Games.Any(g => g.GameId == GameIdentifiers.QuizGameId))
            {
                _logger.LogWarning("Event {eventId} not containing quiz game", eventId);
                Context.Abort();
                return;
            }

            var quizInfo = eventGameInfo.Games.First(g => g.GameId == GameIdentifiers.QuizGameId);
            if (quizInfo.StartTime == null)
            {
                _logger.LogWarning("Quiz start time is missing for event {eventId}", eventId);
                Context.Abort();
                return;
            }

            var currentTime = DateTimeOffset.UtcNow;
            var minAllowTime = quizInfo.StartTime.Value.Add(TimeSpan.FromMinutes(-10));
            var maxAllowTime = quizInfo.StartTime.Value;
            if (currentTime < minAllowTime || currentTime > maxAllowTime)
            {
                _logger.LogWarning("User {userId} tried to connect to quiz game {eventId} outside the allowed time", Context.UserIdentifier, eventId);
                Context.Abort();
                return;
            }

            // Send quiz information to the user
            var quizGame = await _eventGameService.GetQuizInfoAsync(eventId, quizInfo.QuizzCollectionId!.Value);
            var quiz = quizGame.Adapt<QuizInfoDto>();
            await Clients.User(Context.UserIdentifier!).ReceiveQuizInfo(quiz);

            await Groups.AddToGroupAsync(Context.ConnectionId, eventId.ToString());

            // Increment the number of players
            IDatabase _redisDatabase = _redisConnection.GetDatabase();
            var numberOfPlayersKey = RedisCacheKeys.EventQuizNumberOfPlayersKey(eventId);
            var numberOfPlayers = await _redisDatabase.StringIncrementAsync(numberOfPlayersKey);
            await Clients.Group(eventId.ToString()).ReceiveQuizNumberOfPlayers(numberOfPlayers);

            await base.OnConnectedAsync();
        }
        else
        {
            _logger.LogWarning("User {userId} tried to connect to quiz game with invalid eventId", Context.UserIdentifier);
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
            IDatabase _redisDatabase = _redisConnection.GetDatabase();
            var numberOfPlayersKey = RedisCacheKeys.EventQuizNumberOfPlayersKey(eventId);
            var numberOfPlayers = await _redisDatabase.StringDecrementAsync(numberOfPlayersKey);
            await Clients.Group(eventId.ToString()).ReceiveQuizNumberOfPlayers(numberOfPlayers);

            await base.OnDisconnectedAsync(exception);
        }
    }

    public async Task SubmitAnswerAsync(int optionIndex)
    {
        // Get event id
        var eventIdString = Context.GetHttpContext()?.Request.Query["eventId"];
        var userId = Guid.Parse(Context.UserIdentifier!);

        if (!Guid.TryParse(eventIdString, out var eventId))
        {
            _logger.LogWarning("User submited wrong eventId");
            return;
        }

        // Get the current question index
        var currentQuestionString = await _cache.GetStringAsync(RedisCacheKeys.CurrentQuizQuestionKey(eventId));
        if (string.IsNullOrEmpty(currentQuestionString))
        {
            _logger.LogWarning("No active question for event {eventId}", eventId);
            return;
        }
        var currentQuestion = JsonSerializer.Deserialize<CurrentQuestionDto>(currentQuestionString)!;

        // Retrieve the event info and quiz info
        var eventGameInfo = await _eventGameService.GetEventInfoAsync(eventId);
        if (eventGameInfo == null ||
            !eventGameInfo.Games.Any(g => g.GameId == GameIdentifiers.QuizGameId))
        {
            _logger.LogWarning("Invalid event {eventId}", eventId);
            return;
        }
        var quizGame = eventGameInfo.Games.First(g => g.GameId == GameIdentifiers.QuizGameId);

        var quiz = await _eventGameService.GetQuizInfoAsync(eventId, quizGame.QuizzCollectionId!.Value);
        if (quiz == null || currentQuestion.Index >= quiz.Questions.Count)
        {
            _logger.LogWarning("Invalid question for event {eventId}", eventId);
            return;
        }

        // Check if user already answered the question
        var scoresKey = RedisCacheKeys.EventQuizScoresKey(eventId);
        var scoresString = await _cache.GetStringAsync(scoresKey);
        var scores = string.IsNullOrEmpty(scoresString)
            ? new QuizScoresDto()
            : JsonSerializer.Deserialize<QuizScoresDto>(scoresString)!;

        if (scores.Scores.ContainsKey(userId) && scores.Scores[userId].ContainsKey(currentQuestion.Index))
        {
            _logger.LogWarning("User {userId} already answered question {questionIndex} for event {eventId}", userId, currentQuestion.Index, eventId);
            return;
        }

        // Check the answer
        var question = quiz.Questions[currentQuestion.Index];

        var correctOption = question.Options
            .Select((option, index) => new { option, index })
            .First(o => o.option.IsCorrect);

        int score = 0;
        if (optionIndex == correctOption.index)
        {
            // Calculate the score based on the time taken to answer
            var answerTime = DateTimeOffset.UtcNow;
            var timeTaken = (answerTime - currentQuestion.StartTime).TotalSeconds;

            // Calculate score
            int baseScore = 1000;
            score = Math.Max(100, (int)(baseScore * (10 - timeTaken) / 10));
        }

        var answerScore = new QuizAnswerScoreDto
        {
            QuestionIndex = currentQuestion.Index,
            CorrectOptionIndex = correctOption.index,
            Score = score
        };

        // Save the score
        if (!scores.Scores.ContainsKey(userId))
            scores.Scores[userId] = new Dictionary<int, int>();
        scores.Scores[userId][currentQuestion.Index] = score;

        await _cache.SetStringAsync(scoresKey, JsonSerializer.Serialize(scores));

        // Send the result to the client
        await Clients.User(userId.ToString()).ReceiveAnswerScore(answerScore);
    }
}
