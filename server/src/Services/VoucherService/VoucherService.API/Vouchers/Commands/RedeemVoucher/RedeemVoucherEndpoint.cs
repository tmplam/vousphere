using BuildingBlocks.Auth.Constants;
using BuildingBlocks.Shared;
using Microsoft.AspNetCore.Mvc;

namespace VoucherService.API.Vouchers.Commands.RedeemVoucher;

public class RedeemVoucherEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/vouchers/{voucherId:guid}/redeem", async (
            [FromRoute] Guid voucherId,
            [FromServices] ISender sender) =>
        {
            var command = new RedeemVoucherCommand(voucherId);
            var result = await sender.Send(command);

            return Results.Ok(ApiResult.Success(message: "Redeemed voucher successful"));
        })
            .RequireAuthorization(AuthPolicy.Player);
    }
}
