using BuildingBlocks.Auth.Constants;
using Microsoft.AspNetCore.Mvc;

namespace VoucherService.API.Vouchers.Commands.RedeemVoucher;

public class RedeemVoucherEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/vouchers/{voucherId:guid}/redeem", async (
            [FromRoute] Guid voucherId,
            [FromServices] ISender sender) =>
        {
            var command = new RedeemVoucherCommand(voucherId);
            var result = await sender.Send(command);

            return Results.NoContent();
        })
            .RequireAuthorization(AuthPolicy.Player);
    }
}
