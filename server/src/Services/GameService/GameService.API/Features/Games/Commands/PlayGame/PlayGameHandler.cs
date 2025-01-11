using BuildingBlocks.Messaging.IntegrationEvents;
using GameService.API.Services;
using GameService.API.Utilities;
using MassTransit;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace GameService.API.Features.Games.Commands.PlayGame;

public record PlayGameCommand(string GameId, Guid EventId) : ICommand<PlayGameResult>;
public record PlayGameResult(
    double? Discount = 0,
    int ItemPiece = -1);

public class PlayGameCommandValidator : AbstractValidator<PlayGameCommand>
{
    public PlayGameCommandValidator()
    {
        RuleFor(q => q.GameId)
            .NotEmpty().WithMessage("Game id is requied");

        RuleFor(q => q.EventId)
            .NotEmpty().WithMessage("EventId query param is requied");
    }
}


public class PlayGameHandler(
    IEventGameService _eventGameService,
    IUserApi _userService,
    IClaimService _claimService,
    IVoucherService _voucherService,
    IDistributedCache _cache,
    IPublishEndpoint _publishEndpoint) : 
    ICommandHandler<PlayGameCommand, PlayGameResult>
{
    public async Task<PlayGameResult> Handle(PlayGameCommand command, CancellationToken cancellationToken)
    {
        var eventInfo = await _eventGameService.GetEventInfoAsync(command.EventId);

        if (eventInfo == null)
            throw new BadRequestException("Event is not happening");

        var game = eventInfo.Games.FirstOrDefault(g => g.GameId == command.GameId);

        if (game == null)
            throw new BadRequestException($"Game with id {command.GameId} not existed in this event");

        var userId = Guid.Parse(_claimService.GetUserId());
        var remainedTurn = await _userService.CheckUserRemainTurnAsync(userId);

        if (!remainedTurn)
            throw new BadRequestException("You have no turn to play game");

        var voucher = await _voucherService.RandomVoucherAsync(eventInfo.EventId, game.GameId);

        if (voucher.VoucherTypeId.HasValue)
        {
            var voucherType = eventInfo.VoucherTypes.FirstOrDefault(vt => vt.Id == voucher.VoucherTypeId);
            voucherType!.Remaining--;
            await _cache.SetStringAsync(RedisCacheKeys.EventInfoKey(eventInfo.EventId), JsonSerializer.Serialize(eventInfo));

            var voucherCreatedMessage = new VoucherCreatedIntegrationEvent
            {
                OwnerId = userId,
                EventId = eventInfo.EventId,
                GameId = game.GameId,
                VoucherId = voucherType.Id,
                Discount = voucherType.Discount,
                IssuedAt = DateTimeOffset.UtcNow
            };
            await _publishEndpoint.Publish(voucherCreatedMessage);

            return new PlayGameResult(voucherType?.Discount);
        }

        if (voucher.PieceIndex.HasValue)
        {
            return new PlayGameResult(null, voucher.PieceIndex.Value);
        }

        return new PlayGameResult();
    }
}
