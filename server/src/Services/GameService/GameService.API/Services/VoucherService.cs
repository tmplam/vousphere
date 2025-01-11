using BuildingBlocks.Http.Dtos.Events;
using BuildingBlocks.Messaging.IntegrationEvents;
using GameService.API.Utilities;
using MassTransit;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace GameService.API.Services;


public class VoucherService(
    IEventGameService _eventGameService,
    IPublishEndpoint _publishEndpoint,
    IDistributedCache _cache)
    : IVoucherService
{
    public async Task<GeneratedVoucher> DistributeVoucherAsync(Guid eventId, string gameId, Guid userId)
    {
        var random = new Random();

        // 55% chance of no voucher
        if (random.NextDouble() > 0.45)
            return new GeneratedVoucher();

        var eventInfo = await _eventGameService.GetEventInfoAsync(eventId);
        if (eventInfo == null)
            return new GeneratedVoucher();

        var game = eventInfo.Games.FirstOrDefault(g => g.GameId == gameId);
        if (game == null)
            return new GeneratedVoucher();

        var voucherTypes = eventInfo.VoucherTypes;
        var item = eventInfo.Item;

        var choices = new List<GeneratedVoucher>();

        if (voucherTypes != null)
            foreach (var voucherType in voucherTypes.Where(t => t.Remaining > 0))
                choices.Add(new GeneratedVoucher { VoucherTypeId = voucherType.Id });

        if (game.PopUpItemsEnabled && item != null)
            for (var i = 0; i < item.NumberPieces; i++)
                choices.Add(new GeneratedVoucher { PieceIndex = i });

        if (choices.Count > 0)
        {
            var selectedVoucher = choices[random.Next(choices.Count)];
            await UpdateCacheAndSendIntegrationEventAsync(eventInfo, selectedVoucher, gameId, userId);
            return selectedVoucher;
        }

        return new GeneratedVoucher();
    }

    public async Task<List<GeneratedVoucher>> DistributeVoucherListAsync(Guid eventId, string gameId, List<Guid> userIds)
    {
        var random = new Random();

        var eventInfo = await _eventGameService.GetEventInfoAsync(eventId);
        if (eventInfo == null)
            return Enumerable.Repeat(new GeneratedVoucher(), userIds.Count).ToList();

        var game = eventInfo.Games.FirstOrDefault(g => g.GameId == gameId);
        if (game == null)
            return Enumerable.Repeat(new GeneratedVoucher(), userIds.Count).ToList();

        var voucherTypes = eventInfo.VoucherTypes;
        var item = eventInfo.Item;

        var choices = new List<GeneratedVoucher>();
        var result = new List<GeneratedVoucher>();

        if (voucherTypes != null)
        {
            foreach (var voucherType in voucherTypes.Where(t => t.Remaining > 0))
            {
                choices.AddRange(
                    Enumerable.Repeat(
                        new GeneratedVoucher { VoucherTypeId = voucherType.Id } , 
                        voucherType.Remaining));
            }
        }

        if (game.PopUpItemsEnabled && item != null)
        {
            for (var i = 0; i < item.NumberPieces; i++)
                choices.Add(new GeneratedVoucher { PieceIndex = i });
        }


        while (result.Count < userIds.Count && choices.Count > 0)
        {
            var index = random.Next(choices.Count);
            var selectedVoucher = choices[index];
            result.Add(selectedVoucher);
            choices.RemoveAt(index);

            // Update the cache and send integration event for each user
            await UpdateCacheAndSendIntegrationEventAsync(
                eventInfo, 
                selectedVoucher, 
                gameId, 
                userIds[result.Count - 1]);
        }

        while (result.Count < userIds.Count)
            result.Add(new GeneratedVoucher());

        return result;
    }

    private async Task UpdateCacheAndSendIntegrationEventAsync(
        InternalEventInfoDto eventInfo, 
        GeneratedVoucher selectedVoucher,
        string gameId,
        Guid userId)
    {
        if (selectedVoucher.VoucherTypeId.HasValue)
        {
            var voucherType = eventInfo.VoucherTypes.FirstOrDefault(vt => vt.Id == selectedVoucher.VoucherTypeId.Value);
            if (voucherType != null)
            {
                voucherType.Remaining--;

                // Update the cache
                await _cache.SetStringAsync(RedisCacheKeys.EventInfoKey(eventInfo.EventId), JsonSerializer.Serialize(eventInfo));

                // Send integration event
                var voucherCreatedEvent = new VoucherCreatedIntegrationEvent
                {
                    VoucherId = Guid.NewGuid(),
                    OwnerId = userId,
                    EventId = eventInfo.EventId,
                    GameId = gameId,
                    Discount = voucherType.Discount,
                    IssuedAt = DateTimeOffset.UtcNow,
                };

                await _publishEndpoint.Publish(voucherCreatedEvent);
            }
        }
        else if (selectedVoucher.PieceIndex.HasValue)
        {
            // Send integration event
            var itemPieceCreatedEvent = new ItemPieceCreatedIntegrationEvent
            {
                OwnerId = userId,
                EventId = eventInfo.EventId,
                GameId = gameId,
                PieceIndex = selectedVoucher.PieceIndex.Value,
            };

            await _publishEndpoint.Publish(itemPieceCreatedEvent);
        }
    }
}
