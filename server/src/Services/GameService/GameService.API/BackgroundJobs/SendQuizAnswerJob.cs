using GameService.API.Hubs;
using GameService.API.Services;
using Microsoft.AspNetCore.SignalR;
using Quartz;

namespace GameService.API.BackgroundJobs;

public class SendQuizAnswerJob(
    ILogger<SendQuizAnswerJob> _logger,
    IEventGameService _eventGameService,
    IHubContext<QuizGameHub, IQuizGameClient> _hubContext) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        if (!context.MergedJobDataMap.TryGetGuidValueFromString("eventId", out var eventId))
        {
            _logger.LogError("Event id is missing in SendQuizAnswerJob data.");
            return;
        }

        if (!context.MergedJobDataMap.TryGetGuidValueFromString("quizId", out var quizId))
        {
            _logger.LogError("Quiz id is missing in SendQuizAnswerJob data.");
            return;
        }

        if (!context.MergedJobDataMap.TryGetIntValueFromString("questionIndex", out var questionIndex))
        {
            _logger.LogError("Question index is missing in SendQuizAnswerJob data.");
            return;
        }

        // Retrieve the quiz and question information from the database or cache
        var quiz = await _eventGameService.GetQuizInfoAsync(eventId, quizId);
        if (quiz == null || questionIndex >= quiz.Questions.Count)
        {
            return;
        }

        var question = quiz.Questions[questionIndex];

        // Send the answer to all clients in the quiz group
        await _hubContext.Clients.Group(eventId.ToString()).ReceiveQuestionAnswer();

        // Schedule the job to send the next question
        if (questionIndex + 1 < quiz.Questions.Count)
        {
            var nextQuestionJobData = new JobDataMap
            {
                { "eventId", eventId.ToString() },
                { "quizId", quizId.ToString() },
                { "questionIndex", (questionIndex + 1).ToString() }
            };

            var nextQuestionJob = JobBuilder.Create<SendQuizQuestionJob>()
                .WithIdentity($"send-quiz-question-{quizId}-{questionIndex + 1}", "quiz-questions")
                .SetJobData(nextQuestionJobData)
                .Build();

            var nextQuestionTrigger = TriggerBuilder.Create()
                .WithIdentity($"trigger-send-quiz-question-{quizId}-{questionIndex + 1}", "quiz-questions")
                .StartAt(DateBuilder.FutureDate(5, IntervalUnit.Second))
                .Build();

            var scheduler = context.Scheduler;
            await scheduler.ScheduleJob(nextQuestionJob, nextQuestionTrigger);
        }
    }
}
