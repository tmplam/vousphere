using BuildingBlocks.Auth.Services;
using BuildingBlocks.CQRS;
using BuildingBlocks.Http.InternalServiceApis;
using VoucherService.API.Dtos;

namespace VoucherService.API.Vouchers.Queries.GetUserItemPieces;

public record GetUserItemPiecesQuery() : IQuery<GetUserItemPiecesResult>;
public record GetUserItemPiecesResult(List<EventItemPiecesDto> EventItemPieces);

public class GetUserItemPiecesHandler(
    IDocumentSession _session,
    IClaimService _claimService,
    IEventApi _eventService) : IQueryHandler<GetUserItemPiecesQuery, GetUserItemPiecesResult>
{
    public async Task<GetUserItemPiecesResult> Handle(GetUserItemPiecesQuery query, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_claimService.GetUserId());

        var itemPiecesGroups = (await _session.Query<ItemPiece>()
            .Where(v => v.OwnerId == userId)
            .ToListAsync(cancellationToken))
            .GroupBy(v => v.EventId);

        var eventIds = itemPiecesGroups.Select(v => v.Key).ToList();
        var result = new List<EventItemPiecesDto>();

        if (eventIds.Count != 0)
        {
            var eventsInfo = await _eventService.GetEventsInfoAsync(eventIds);
            foreach (var group in itemPiecesGroups)
            {
                var eventInfo = eventsInfo[group.Key];
                var eventItemPieces = new EventItemPiecesDto
                {
                    Event = eventInfo,
                    ItemPieces = group.ToList()
                };
                result.Add(eventItemPieces);
            }
        }
        
        return new GetUserItemPiecesResult(result);
    }
}