using EventService.API.BackgroundJobs;
using Quartz;

namespace EventService.API.Events.Commands.ApproveEvent;

public record ApproveEventCommand(Guid EventId) : ICommand<ApproveEventResult>;
public record ApproveEventResult();


public class ApproveEventHandler(
    IDocumentSession _session,
    ISchedulerFactory _schedulerFactory)
    : ICommandHandler<ApproveEventCommand, ApproveEventResult>
{
    public async Task<ApproveEventResult> Handle(ApproveEventCommand command, CancellationToken cancellationToken)
    {
        var existingEvent = await _session.LoadAsync<Event>(command.EventId);

        if (existingEvent == null) throw new NotFoundException("Event not found");

        if (existingEvent.Status == EventStatus.Happening || existingEvent.Status == EventStatus.Ended)
            throw new BadRequestException("Event is already happening or ended");

        existingEvent.Status = EventStatus.Pending;
        existingEvent.Comment = null;
        _session.Update(existingEvent);

        // Schedule a job to start the event
        var scheduler = await _schedulerFactory.GetScheduler();

        var jobData = new JobDataMap
        {
            { "eventId", existingEvent.Id },
        };

        var job = JobBuilder.Create<EventStartedJob>()
            .WithIdentity($"evennt-started-{Guid.NewGuid()}", "events-started")
            .SetJobData(jobData)
            .Build();

        var trigger = TriggerBuilder.Create()
            .WithIdentity($"trigger-{Guid.NewGuid()}", "events-started")
            .StartAt(existingEvent.StartTime)
            .Build();


        await Task.WhenAll(
            _session.SaveChangesAsync(),
            scheduler.ScheduleJob(job, trigger)
        );

        return new ApproveEventResult();
    }
}
