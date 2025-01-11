using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;

namespace VoucherService.API.Vouchers.EventHandlers.IntegrationEventHandlers;

public class ItemPieceCreatedIntegrationEventHandler(
    IDocumentSession _session) 
    : IConsumer<ItemPieceCreatedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<ItemPieceCreatedIntegrationEvent> context)
    {
        var existingItemPiece = _session.Query<ItemPiece>()
            .FirstOrDefault(p => 
                p.OwnerId == context.Message.OwnerId && 
                p.EventId == context.Message.EventId && 
                p.PieceIndex == context.Message.PieceIndex);

        if (existingItemPiece != null)
        {
            existingItemPiece.Count++;
            _session.Update(existingItemPiece);
        }
        else
        {
            var itemPiece = new ItemPiece
            {
                Id = Guid.NewGuid(),
                OwnerId = context.Message.OwnerId,
                BrandId = context.Message.BrandId,
                EventId = context.Message.EventId,
                GameId = context.Message.GameId,
                PieceIndex = context.Message.PieceIndex,
                Count = 1
            };
            _session.Store(itemPiece);
        }

        await _session.SaveChangesAsync();
    }
}
