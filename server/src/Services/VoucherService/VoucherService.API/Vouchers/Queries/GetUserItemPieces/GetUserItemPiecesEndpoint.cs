using BuildingBlocks.Shared;
using Microsoft.AspNetCore.Mvc;

namespace VoucherService.API.Vouchers.Queries.GetUserItemPieces;

public class GetUserItemPiecesEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/vouchers/item-pieces", async (
            [FromServices] ISender sender) =>
        {
            var query = new GetUserItemPiecesQuery();

            var result = await sender.Send(query);
            
            return Results.Ok(ApiResult.Success(result.EventItemPieces));
        })
            .RequireAuthorization();
    }
}
