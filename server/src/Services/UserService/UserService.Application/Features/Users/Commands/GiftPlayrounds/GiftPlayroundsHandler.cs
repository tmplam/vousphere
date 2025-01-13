using BuildingBlocks.Auth.Services;
using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;
using System.Security.Claims;

namespace UserService.Application.Features.Users.Commands.GiftPlayrounds;

internal sealed class GiftPlayroundsHandler(
    IPlayerRepository _playerRepository,
    IUnitOfWork _unitOfWork,
    IClaimService _claimService,
    IPublishEndpoint _publishEndpoint) : ICommandHandler<GiftPlayroundsCommand, GiftPlayroundsResult>
{
    public async Task<GiftPlayroundsResult> Handle(GiftPlayroundsCommand command, CancellationToken cancellationToken)
    {
        var senderId = Guid.Parse(_claimService.GetUserId());
        var senderEmail = _claimService.GetClaim(ClaimTypes.Email)!;

        var sender = await _playerRepository.FirstOrDefaultAsync(u => u.UserId == senderId);
        if (sender == null)
            throw new NotFoundException(nameof(Player), senderId);

        if (sender.NumberOfPlays < command.NumberOfRounds)
            throw new BadRequestException("Not enough playrounds");

        var recipient = await _playerRepository.FirstOrDefaultAsync(u => u.UserId == command.RecipientId);

        if (recipient == null)
            throw new NotFoundException("Recipient not found");

        sender.NumberOfPlays -= command.NumberOfRounds;
        recipient.NumberOfPlays += command.NumberOfRounds;

        var playRoundsGiftedMessage = new PlayroundsGiftedIntegrationEvent
        {
            SenderId = senderId,
            SenderEmail = senderEmail,
            RecipientId = command.RecipientId,
            NumberOfPlayrounds = command.NumberOfRounds
        };

        await Task.WhenAll(
            _publishEndpoint.Publish(playRoundsGiftedMessage, cancellationToken),
            _unitOfWork.SaveChangesAsync(cancellationToken));

        return new GiftPlayroundsResult();
    }
}
