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
        if (!context.MergedJobDataMap.TryGetGuidValueFromString("eventId", out var eventId))
        {
            _logger.LogError("Event ID is missing in EventStartedJob data.");
            return;
        }

        var eventData = await _session.LoadAsync<Entities.Event>(eventId);

        if (eventData == null)
        {
            _logger.LogError($"Event with ID {eventId} not found in EventStartedJob");
            return;
        }

        _logger.LogInformation($"Processing event with ID {eventId} in EventStartedJob");

        eventData.Status = EventStatus.Happening;
        _session.Store(eventData);

        var eventStartedMessage = new EventStartedIntegrationEvent
        {
            EventId = eventId,
            EventName = eventData.Name,
            Description = eventData.Description,
            ImageId = eventData.ImageId,
            BrandId = eventData.BrandId,
        };

        await Task.WhenAll(
            _session.SaveChangesAsync(),
            _publishEndpoint.Publish(eventStartedMessage)
        );
    }
}
