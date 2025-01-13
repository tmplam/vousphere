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

        var startJobKey = new JobKey($"event-started-{existingEvent.Id}", "events-started");
        var startTriggerKey = new TriggerKey($"trigger-event-started-{existingEvent.Id}", "events-started");

        var startJobData = new JobDataMap
        {
            { "eventId", existingEvent.Id.ToString() }
        };

        var startJob = JobBuilder.Create<EventStartedJob>()
            .WithIdentity(startJobKey)
            .SetJobData(startJobData)
            .Build();

        var startTrigger = TriggerBuilder.Create()
            .WithIdentity(startTriggerKey)
            .StartAt(existingEvent.StartTime)
            .Build();

        var tasks = Task.CompletedTask;
        if (await scheduler.CheckExists(startJobKey))
        {
            tasks = Task.WhenAll(
                tasks, 
                scheduler.AddJob(startJob, replace: true),
                scheduler.RescheduleJob(startTriggerKey, startTrigger));
        }
        else
        {
            tasks = Task.WhenAll(
                tasks,
                scheduler.ScheduleJob(startJob, startTrigger));
        }


        // Schedule a job to end the event
        var endJobKey = new JobKey($"event-ended-{existingEvent.Id}", "events-ended");
        var endTriggerKey = new TriggerKey($"trigger-event-ended-{existingEvent.Id}", "events-ended");

        var endJobData = new JobDataMap
        {
            { "eventId", existingEvent.Id.ToString() }
        };

        var endJob = JobBuilder.Create<EventEndedJob>()
            .WithIdentity(endJobKey)
            .SetJobData(endJobData)
            .Build();

        var endTrigger = TriggerBuilder.Create()
            .WithIdentity(endTriggerKey)
            .StartAt(existingEvent.EndTime)
            .Build();

        if (await scheduler.CheckExists(endJobKey))
        {
            tasks = Task.WhenAll(
                tasks,
                scheduler.AddJob(endJob, replace: true),
                scheduler.RescheduleJob(endTriggerKey, endTrigger)
            );
        }
        else
        {
            tasks = Task.WhenAll(
                tasks,
                scheduler.ScheduleJob(endJob, endTrigger)
            );
        }

        // Send notification to the brand
        var eventApprovedEvent = new EventApprovedIntegrationEvent
        {
            EventId = existingEvent.Id,
            BrandId = existingEvent.BrandId,
            EventName = existingEvent.Name!,
        };


        await Task.WhenAll(
            tasks,
            _session.SaveChangesAsync(),
            _publishEndpoint.Publish(eventApprovedEvent, cancellationToken)
        );

        return new ApproveEventResult();
    }
}
