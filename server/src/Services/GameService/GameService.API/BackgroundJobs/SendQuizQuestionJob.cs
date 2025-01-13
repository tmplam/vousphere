using GameService.API.Hubs;
using GameService.API.Services;
using GameService.API.Utilities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using Quartz;
using System.Text.Json;

namespace GameService.API.BackgroundJobs;

public class SendQuizQuestionJob(
    ILogger<SendQuizQuestionJob> _logger,
    IEventGameService _eventGameService,
    IDistributedCache _cache,
    IHubContext<QuizGameHub, IQuizGameClient> _hubContext) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        if (!context.MergedJobDataMap.TryGetGuidValueFromString("eventId", out var eventId))
        {
            _logger.LogError("Event id is missing in SendQuizQuestionJob data.");
            return;
        }

        if (!context.MergedJobDataMap.TryGetGuidValueFromString("quizId", out var quizId))
        {
            _logger.LogError("Quiz id is missing in SendQuizQuestionJob data.");
            return;
        }

        if (!context.MergedJobDataMap.TryGetIntValueFromString("questionIndex", out var questionIndex))
        {
            _logger.LogError("Question index is missing in SendQuizQuestionJob data.");
            return;
        }

        var quiz = await _eventGameService.GetQuizInfoAsync(eventId, quizId);
        if (quiz == null)
        {
            _logger.LogError("Quiz with id {quizId} not existed", quizId);
            return;
        }

        //var question = quiz.Questions[questionIndex];

        // Send the question index to all clients in the quiz group
        await _hubContext.Clients.Group(eventId.ToString()).ReceiveQuestion(questionIndex);

        var currentQuestion = new CurrentQuestionDto
        {
            Index = questionIndex,
            StartTime = DateTimeOffset.UtcNow
        };
        await _cache.SetStringAsync(RedisCacheKeys.CurrentQuizQuestionKey(eventId), JsonSerializer.Serialize(currentQuestion));

        // Schedule the job to send the answer after the question duration
        var answerJobData = new JobDataMap
        {
            { "eventId", eventId.ToString() },
            { "quizId", quizId.ToString() },
            { "questionIndex", questionIndex.ToString() }
        };

        var answerJob = JobBuilder.Create<SendQuizAnswerJob>()
            .WithIdentity($"send-quiz-answer-{quizId}-{questionIndex}", "quiz-answers")
            .SetJobData(answerJobData)
            .Build();

        var answerTrigger = TriggerBuilder.Create()
            .WithIdentity($"trigger-send-quiz-answer-{quizId}-{questionIndex}", "quiz-answers")
            .StartAt(DateBuilder.FutureDate(18, IntervalUnit.Second))
            .Build();

        var scheduler = context.Scheduler;
        await scheduler.ScheduleJob(answerJob, answerTrigger);
    }
}
