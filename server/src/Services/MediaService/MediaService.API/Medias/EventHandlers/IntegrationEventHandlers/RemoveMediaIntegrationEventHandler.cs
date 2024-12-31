using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;

namespace MediaService.API.Medias.EventHandlers.IntegrationEventHandlers;

public class RemoveMediaIntegrationEventHandler(
    ILogger<RemoveMediaIntegrationEventHandler> logger,
    IDocumentSession session,
    IFileStorageService fileStorageService) : IConsumer<RemoveMediaIntegrationEvent>
{
    public async Task Consume(ConsumeContext<RemoveMediaIntegrationEvent> context)
    {
        var media = await session.LoadAsync<Media>(context.Message.MediaId);

        if (media != null)
        {
            session.Delete(media);

            await Task.WhenAll(
                fileStorageService.RemoveFileAsync(media.Url),
                session.SaveChangesAsync()
            );

            logger.LogInformation("Removed media with id {MediaId}", context.Message.MediaId);
        }
        else
        {
            logger.LogWarning("Media with id {MediaId} not found", context.Message.MediaId);
        }
    }
}

