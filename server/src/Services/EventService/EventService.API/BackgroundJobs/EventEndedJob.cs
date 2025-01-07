using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;
using Quartz;

namespace EventService.API.BackgroundJobs;

public class EventEndedJob(
    ILogger<EventEndedJob> _logger,
    IDocumentSession _session,
    IPublishEndpoint _publishEndpoint) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        if (!context.MergedJobDataMap.TryGetGuidValueFromString("eventId", out var eventId))
        {
            _logger.LogError("Event ID is missing in EventEndedJob data.");
            return;
        }

        var eventData = await _session.LoadAsync<Entities.Event>(eventId);

        if (eventData == null)
        {
            _logger.LogError($"Event with ID {eventId} not found in EventEndedJob");
            return;
        }

        _logger.LogInformation($"Processing event with ID {eventId} in EventEndedJob");

        eventData.Status = EventStatus.Ended;
        _session.Store(eventData);

        var eventEndedMessage = new EventEndedIntegrationEvent
        {
            EventId = eventId
        };

        await Task.WhenAll(
            _session.SaveChangesAsync(),
            _publishEndpoint.Publish(eventEndedMessage)
        );
    }
}
