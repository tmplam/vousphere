using Mapster;
using Microsoft.AspNetCore.Mvc;

namespace VoucherService.API.Vouchers.Commands.GiftVoucher;

public record GiftVoucherRequest(Guid RecipientId, Guid VoucherId);

public class GiftVoucherEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/vouchers/gift", async (
            [FromBody] GiftVoucherRequest request,
            [FromServices] ISender sender) =>
        {
            var command = request.Adapt<GiftVoucherCommand>();
            var result = await sender.Send(command);

            return Results.NoContent();
        })
            .RequireAuthorization();
    }
}
