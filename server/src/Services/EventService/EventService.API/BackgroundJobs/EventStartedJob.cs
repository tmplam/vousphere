using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;
using Quartz;

namespace EventService.API.BackgroundJobs;

public class EventStartedJob(
    ILogger<EventStartedJob> _logger,
    IDocumentSession _session,
    IPublishEndpoint _publishEndpoint) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        if (context.MergedJobDataMap.TryGetGuid("eventId", out var eventId))
        {
            _logger.LogError("Event ID is missing in job data.");
            return;
        }

        var eventData = await _session.LoadAsync<Entities.Event>(eventId);

        if (eventData == null)
        {
            _logger.LogError($"Event with ID {eventId} not found in EventStartJob.");
            return;
        }

        _logger.LogInformation($"Processing event with ID {eventId} in EventStartJob.");

        eventData.Status = EventStatus.Happening;

        var eventStartedMessage = new EventStartedIntegrationEvent
        {
            EventId = eventId,
            Name = eventData.Name,
            Description = eventData.Description,
            ImageId = eventData.ImageId
        };

        await Task.WhenAll(
            _session.SaveChangesAsync(),
            _publishEndpoint.Publish(eventStartedMessage)
        );
    }
}
