using Quartz;

namespace EventService.API.BackgroundJobs;

public class EventStartJob : IJob
{
    public Task Execute(IJobExecutionContext context)
    {
        return Task.CompletedTask;
    }
}
