using GameService.API.Hubs;
using GameService.API.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using Quartz;

namespace GameService.API.BackgroundJobs;


public class SendQuizAnswerJob(
    ILogger<SendQuizAnswerJob> _logger,
    IEventGameService _eventGameService,
    IDistributedCache _cache,
    IVoucherService _voucherService,
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
            _logger.LogError("Quiz with id {quizId} not existed or question index {questionIndex} is out of range", quizId, questionIndex);
            return;
        }

        var question = quiz.Questions[questionIndex];

        var correctAnswer = question.Options
            .Select((option, index) => new { option, index })
            .FirstOrDefault(x => x.option.IsCorrect);

        if (correctAnswer != null)
        {
            // Send the answer to all clients in the quiz group
            await _hubContext.Clients.Group(eventId.ToString())
                .ReceiveQuestionAnswer(questionIndex, correctAnswer.index);
        }
        else
        {
            _logger.LogError("Correct answer not found for question {questionIndex} in quiz {quizId}", questionIndex, quizId);
        }

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
        else
        {
            // Schedule the job to send the quiz result
            var quizEndedJobData = new JobDataMap
            {
                { "eventId", eventId.ToString() },
                { "quizId", quizId.ToString() },
            };

            var scheduler = context.Scheduler;

            var quizEndedJob = JobBuilder.Create<QuizEndedJob>()
                .WithIdentity($"quiz-ended-{quizId}", "quiz-ended")
                .SetJobData(quizEndedJobData)
                .Build();

            var quizEndedTrigger = TriggerBuilder.Create()
                .WithIdentity($"trigger-quiz-ended-{quizId}", "quiz-ended")
                .StartAt(DateBuilder.FutureDate(8, IntervalUnit.Second))
                .Build();

            await scheduler.ScheduleJob(quizEndedJob, quizEndedTrigger);
        }
    }
}
