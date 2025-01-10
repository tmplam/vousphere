using Quartz;

namespace MediaService.API.BackgroundJobs;

public class ClearDraftMediasJob(
    IDocumentSession _session,
    IFileStorageService _fileStorageService) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        var draftMedias = await _session.Query<Media>()
            .Where(x =>
                x.Status == MediaStatus.Draft &&
                (DateTimeOffset.UtcNow - x.UploadedAt).TotalHours > 1)
            .ToListAsync();

        var tasks = Task.CompletedTask;
        foreach (var media in draftMedias)
        {
            tasks = Task.WhenAll(
                tasks, 
                _fileStorageService.RemoveFileAsync(media.Url));
            _session.Delete(media);
        }

        await Task.WhenAll(
            tasks,
            _session.SaveChangesAsync());
    }
}
