using BuildingBlocks.Http.Dtos.Events;

namespace VoucherService.API.Dtos;

public class EventItemPiecesDto
{
    public EventInfoDto Event { get; set; } = default!;
    public List<ItemPiece> ItemPieces { get; set; } = new();
}
