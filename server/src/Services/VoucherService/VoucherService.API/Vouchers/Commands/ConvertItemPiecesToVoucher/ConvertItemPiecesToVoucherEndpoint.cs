using BuildingBlocks.Shared;
using Mapster;
using Microsoft.AspNetCore.Mvc;

namespace VoucherService.API.Vouchers.Commands.ConvertItemPiecesToVoucher;

public record ConvertItemPiecesToVoucherRequest(Guid EventId);

public class ConvertItemPiecesToVoucherEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/vouchers/item-pieces-to-voucher", async (
            [FromBody] ConvertItemPiecesToVoucherRequest request,
            [FromServices] ISender sender) =>
        {
            var command = request.Adapt<ConvertItemPiecesToVoucherCommand>();

            var result = await sender.Send(command);

            return Results.Ok(ApiResult.Success(result));
        })
            .RequireAuthorization();
    }
}
