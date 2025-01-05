using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;

namespace MediaService.API.Medias.EventHandlers.IntegrationEventHandlers;

public class RemoveMediaIntegrationEventHandler(
    ILogger<RemoveMediaIntegrationEventHandler> _logger,
    IDocumentSession _session,
    IFileStorageService _fileStorageService)
    : IConsumer<RemoveMediaIntegrationEvent>
{
    public async Task Consume(ConsumeContext<RemoveMediaIntegrationEvent> context)
    {
        var media = await _session.LoadAsync<Media>(context.Message.MediaId);

        if (media != null)
        {
            _session.Delete(media);

            await Task.WhenAll(
                _fileStorageService.RemoveFileAsync(media.Url),
                _session.SaveChangesAsync()
            );

            _logger.LogInformation("Removed media with id {MediaId}", context.Message.MediaId);
        }
        else
        {
            _logger.LogWarning("Media with id {MediaId} not found", context.Message.MediaId);
        }
    }
}

