using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace UserService.Application.Features.Users.EventHandlers.IntegrationEventHandlers;

public class UserPlayedGameIntegrationEventHandler(
    ILogger<UserPlayedGameIntegrationEventHandler> _logger,
    IPlayerRepository _playerRepository,
    IUnitOfWork _unitOfWork) : IConsumer<UserPlayedGameIntegrationEvent>
{
    public async Task Consume(ConsumeContext<UserPlayedGameIntegrationEvent> context)
    {
        var player = await _playerRepository.FirstOrDefaultAsync(p => p.UserId == context.Message.UserId);

        if (player != null)
        {
            _logger.LogInformation("User {UserId} played game {GameId} at {PlayedAt}", context.Message.UserId, context.Message.GameId, context.Message.PlayedAt);
            player.NumberOfPlays--;
            await _unitOfWork.SaveChangesAsync();
        }
        else
        {
            _logger.LogWarning("Player with id {UserId} not found", context.Message.UserId);
        }
    }
}
