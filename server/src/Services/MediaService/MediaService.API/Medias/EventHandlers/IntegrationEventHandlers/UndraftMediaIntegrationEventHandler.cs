using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;

namespace MediaService.API.Medias.EventHandlers.IntegrationEventHandlers;

public class UndraftMediaIntegrationEventHandler(
    ILogger<UndraftMediaIntegrationEventHandler> logger,
    IDocumentSession session) : IConsumer<UndraftMediaIntegrationEvent>
{
    public async Task Consume(ConsumeContext<UndraftMediaIntegrationEvent> context)
    {
        var media = await session.LoadAsync<Media>(context.Message.MediaId);

        if (media != null)
        {
            media.Status = MediaStatus.Published;
            session.Update(media);
            await session.SaveChangesAsync();

            logger.LogInformation("Undrafted media with id {MediaId}", context.Message.MediaId);
        }
        else
        {
            logger.LogWarning("Media with id {MediaId} not found", context.Message.MediaId);
        }
    }
}
