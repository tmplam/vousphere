using BuildingBlocks.Auth.Services;
using BuildingBlocks.CQRS;
using BuildingBlocks.Exceptions;
using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;
using System.Security.Claims;

namespace VoucherService.API.Vouchers.Commands.GiftItemPiece;

public record GiftItemPieceCommand(
    Guid RecipientId, 
    Guid ItemPieceId, 
    int Quantity) : ICommand<GiftItemPieceResult>;
public record GiftItemPieceResult();

public class GiftItemPieceCommandValidator : AbstractValidator<GiftItemPieceCommand>
{
    public GiftItemPieceCommandValidator()
    {
        RuleFor(x => x.RecipientId)
            .NotEmpty().WithMessage("User id is required");
        RuleFor(x => x.ItemPieceId)
            .NotEmpty().WithMessage("ItemPiece id is required");
        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than 0");
    }
}

public class GiftItemPieceHandler(
    IDocumentSession _session,
    IClaimService _claimService,
    IPublishEndpoint _publishEndpoint) : ICommandHandler<GiftItemPieceCommand, GiftItemPieceResult>
{
    public async Task<GiftItemPieceResult> Handle(GiftItemPieceCommand command, CancellationToken cancellationToken)
    {
        var senderId = Guid.Parse(_claimService.GetUserId());
        var senderEmail = _claimService.GetClaim(ClaimTypes.Email)!;

        var senderItemPieces = await _session.LoadAsync<ItemPiece>(command.ItemPieceId, cancellationToken);

        if (senderItemPieces == null || senderItemPieces.OwnerId != senderId)
            throw new NotFoundException("ItemPiece not found");
        if (senderItemPieces.Count < command.Quantity)
            throw new BadRequestException("Not enough pieces");

        var recipientItemPieces = await _session.Query<ItemPiece>()
            .Where(x =>
                x.OwnerId == command.RecipientId &&
                x.EventId == senderItemPieces.EventId &&
                x.PieceIndex == senderItemPieces.PieceIndex)
            .FirstOrDefaultAsync(cancellationToken);

        if (recipientItemPieces == null)
        {
            recipientItemPieces = new ItemPiece
            {
                Id = Guid.NewGuid(),
                OwnerId = command.RecipientId,
                EventId = senderItemPieces.EventId,
                BrandId = senderItemPieces.BrandId,
                GameId = senderItemPieces.GameId,
                PieceIndex = senderItemPieces.PieceIndex,
                Count = command.Quantity
            };
            _session.Store(recipientItemPieces);
        }
        else
        {
            recipientItemPieces.Count += command.Quantity;
            _session.Update(recipientItemPieces);
        }

        senderItemPieces.Count -= command.Quantity;
        if (senderItemPieces.Count == 0)
            _session.Delete(senderItemPieces);
        else
            _session.Update(senderItemPieces);

        var ItemPieceGiftedMessage = new ItemPieceGiftedIntegrationEvent
        {
            SenderId = senderId,
            SenderEmail = senderEmail,
            RecipientId = command.RecipientId,
            EventId = senderItemPieces.EventId,
            BrandId = senderItemPieces.BrandId,
            PieceIndex = senderItemPieces.PieceIndex,
            Quantity = command.Quantity,
        };

        await Task.WhenAll(
            _publishEndpoint.Publish(ItemPieceGiftedMessage, cancellationToken),
            _session.SaveChangesAsync(cancellationToken)
        );

        return new GiftItemPieceResult();
    } 
}
