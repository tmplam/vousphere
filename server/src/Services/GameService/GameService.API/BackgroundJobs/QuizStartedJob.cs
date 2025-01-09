using Quartz;

namespace GameService.API.BackgroundJobs;

public class QuizStartedJob : IJob
{
    public Task Execute(IJobExecutionContext context)
    {
        return Task.CompletedTask;
    }
}
