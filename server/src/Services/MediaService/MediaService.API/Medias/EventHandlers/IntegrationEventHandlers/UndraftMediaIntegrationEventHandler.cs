using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;

namespace MediaService.API.Medias.EventHandlers.IntegrationEventHandlers;

public class UndraftMediaIntegrationEventHandler(
    ILogger<UndraftMediaIntegrationEventHandler> _logger,
    IDocumentSession _session)
    : IConsumer<UndraftMediaIntegrationEvent>
{
    public async Task Consume(ConsumeContext<UndraftMediaIntegrationEvent> context)
    {
        var media = await _session.LoadAsync<Media>(context.Message.MediaId);

        if (media != null)
        {
            media.Status = MediaStatus.Published;
            _session.Update(media);
            await _session.SaveChangesAsync();

            _logger.LogInformation("Undrafted media with id {MediaId}", context.Message.MediaId);
        }
        else
        {
            _logger.LogWarning("Media with id {MediaId} not found", context.Message.MediaId);
        }
    }
}
