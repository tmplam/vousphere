using BuildingBlocks.Messaging.IntegrationEvents;
using BuildingBlocks.Shared.Constants;
using GameService.API.BackgroundJobs;
using GameService.API.Utilities;
using MassTransit;
using Microsoft.Extensions.Caching.Distributed;
using Quartz;
using System.Text.Json;

namespace GameService.API.Features.Games.EventHandlers.IntegrationEventHandlers;


public class EventStartedIntegrationEventHandler(
    ILogger<EventStartedIntegrationEventHandler> _logger,
    IDistributedCache _cache,
    IEventApi _eventService,
    ISchedulerFactory _schedulerFactory) 
    : IConsumer<EventStartedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<EventStartedIntegrationEvent> context)
    {
        var internalEventInfo = await _eventService.GetInternalEventInfoAsync(context.Message.EventId);

        if (internalEventInfo == null)
        {
            _logger.LogError("Event with id {EventId} not found", context.Message.EventId);
            return;
        }

        await _cache.SetStringAsync(RedisCacheKeys.EventInfoKey(context.Message.EventId), 
            JsonSerializer.Serialize(internalEventInfo));

        if (internalEventInfo.Games.Any(g => g.GameId == GameIdentifiers.QuizGameId))
        {
            var quiz = internalEventInfo.Games.First(g => g.GameId == GameIdentifiers.QuizGameId);

            // Schedule the job to send the answer after the question duration
            var quizStartedJobData = new JobDataMap
            {
                { "eventId", context.Message.EventId.ToString() },
                { "quizId", quiz.QuizzCollectionId.ToString()! },
            };

            var scheduler = await _schedulerFactory.GetScheduler();

            var quizStartedJob = JobBuilder.Create<QuizStartedJob>()
                .WithIdentity($"quiz-started-{quiz.QuizzCollectionId}", "quiz-started")
                .SetJobData(quizStartedJobData)
                .Build();

            var quizStartedTrigger = TriggerBuilder.Create()
                .WithIdentity($"trigger-quiz-started-{quiz.QuizzCollectionId}", "quiz-started")
                .StartAt(quiz.StartTime!.Value)
                .Build();

            await scheduler.ScheduleJob(quizStartedJob, quizStartedTrigger);
        }
    }
}
