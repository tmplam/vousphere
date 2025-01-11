namespace GameService.API.Services;

public class VoucherService(
    IEventGameService _eventGameService,)
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
            return choices[random.Next(choices.Count)];
        }

        return new GeneratedVoucher();
    }

    public async Task<List<GeneratedVoucher>> DistributeVoucherListAsync(Guid eventId, int quantity, string gameId)
    {
        var random = new Random();

        var eventInfo = await _eventGameService.GetEventInfoAsync(eventId);
        if (eventInfo == null)
            return Enumerable.Repeat(new GeneratedVoucher(), quantity).ToList();

        var game = eventInfo.Games.FirstOrDefault(g => g.GameId == gameId);
        if (game == null)
            return Enumerable.Repeat(new GeneratedVoucher(), quantity).ToList();

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


        while (result.Count < quantity && choices.Count > 0)
        {
            var index = random.Next(choices.Count);
            result.Add(choices[index]);
            choices.RemoveAt(index);
        }

        while (result.Count < quantity)
            result.Add(new GeneratedVoucher());

        return result;
    }
}
