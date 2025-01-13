using GameService.API.Hubs;
using GameService.API.Services;
using GameService.API.Utilities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using Quartz;
using System.Text.Json;

namespace GameService.API.BackgroundJobs; 

public class QuizStartedJob(
    ILogger<QuizStartedJob> _logger,
    IDistributedCache _cache,
    IEventGameService _eventGameService,
    IHubContext<QuizGameHub, IQuizGameClient> _hubContext) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        if (!context.MergedJobDataMap.TryGetGuidValueFromString("eventId", out var eventId))
        {
            _logger.LogError("Event id is missing in QuizStartedJob data.");
            return;
        }

        if (!context.MergedJobDataMap.TryGetGuidValueFromString("quizId", out var quizId))
        {
            _logger.LogError("Event id is missing in QuizStartedJob data.");
            return;
        }

        await _cache.SetStringAsync(RedisCacheKeys.EventQuizScoresKey(eventId), 
            JsonSerializer.Serialize(new QuizScoresDto()));

        var quiz = await _eventGameService.GetQuizInfoAsync(eventId, quizId);

        // Send the quiz started message to all clients in the quiz group
        await _hubContext.Clients.Group(eventId.ToString())
            .ReceiveQuizCountdown(15);

        // Schedule the job to send the first question
        var jobData = new JobDataMap
        {
            { "eventId", eventId.ToString() },
            { "quizId", quizId.ToString() },
            { "questionIndex", 0.ToString() }
        };

        var job = JobBuilder.Create<SendQuizQuestionJob>()
            .WithIdentity($"send-quiz-question-{quizId}-{0}", "quiz-questions")
            .UsingJobData(jobData)
            .Build();

        var trigger = TriggerBuilder.Create()
            .WithIdentity($"send-quiz-question-trigger-{quizId}-{0}", "quiz-questions")
            .StartAt(DateBuilder.FutureDate(15, IntervalUnit.Second))
            .Build();

        await context.Scheduler.ScheduleJob(job, trigger);
    }
}
