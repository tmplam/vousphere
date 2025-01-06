using BuildingBlocks.Messaging.IntegrationEvents;
using EventService.API.BackgroundJobs;
using MassTransit;
using Quartz;

namespace EventService.API.Events.Commands.ApproveEvent;

public record ApproveEventCommand(Guid EventId) : ICommand<ApproveEventResult>;
public record ApproveEventResult();


public class ApproveEventHandler(
    IDocumentSession _session,
    IPublishEndpoint _publishEndpoint,
    ISchedulerFactory _schedulerFactory)
    : ICommandHandler<ApproveEventCommand, ApproveEventResult>
{
    public async Task<ApproveEventResult> Handle(ApproveEventCommand command, CancellationToken cancellationToken)
    {
        var existingEvent = await _session.LoadAsync<Entities.Event>(command.EventId);

        if (existingEvent == null) throw new NotFoundException("Event not found");

        if (existingEvent.Status == EventStatus.Pending)
            throw new BadRequestException("Event is already approved");

        if (existingEvent.Status == EventStatus.Happening)
            throw new BadRequestException("Event is already happening");

        if (existingEvent.Status == EventStatus.Ended)
            throw new BadRequestException("Event is already ended");

        existingEvent.Status = EventStatus.Pending;
        existingEvent.Comment = null;
        _session.Update(existingEvent);

        // Schedule a job to start the event
        var scheduler = await _schedulerFactory.GetScheduler();

        var jobData = new JobDataMap
        {
            { "eventId", existingEvent.Id.ToString() },
        };

        var job = JobBuilder.Create<EventStartedJob>()
            .WithIdentity($"evennt-started-{Guid.NewGuid()}", "events-started")
            .SetJobData(jobData)
            .Build();

        var trigger = TriggerBuilder.Create()
            .WithIdentity($"trigger-{Guid.NewGuid()}", "events-started")
            .StartAt(existingEvent.StartTime)
            .Build();

        // Send notification to the brand
        var eventApprovedEvent = new EventApprovedIntegrationEvent
        {
            EventId = existingEvent.Id,
            BrandId = existingEvent.BrandId,
            EventName = existingEvent.Name,
        };


        await Task.WhenAll(
            _session.SaveChangesAsync(),
            scheduler.ScheduleJob(job, trigger),
            _publishEndpoint.Publish(eventApprovedEvent, cancellationToken)
        );

        return new ApproveEventResult();
    }
}
