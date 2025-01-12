using Mapster;
using Microsoft.AspNetCore.Mvc;

namespace VoucherService.API.Vouchers.Commands.GiftItemPiece;

public record GiftItemPieceRequest(
    Guid RecipientId,
    Guid ItemPieceId,
    int Quantity);


public class GiftItemPieceEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/item-pieces/gift", async (
            [FromBody] GiftItemPieceRequest request,
            [FromServices] ISender sender) =>
        {
            var command = request.Adapt<GiftItemPieceCommand>();
            var result = await sender.Send(command);

            return Results.NoContent();
        })
            .RequireAuthorization();
    }
}
