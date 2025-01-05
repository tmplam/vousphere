using BuildingBlocks.Auth.Enums;
using UserService.Application.Features.Users.Commands.VerifyEmail;

namespace UserService.API.Endpoints;

public record VerifyEmailRequest(string Email, string OtpCode);
public record VerifyEmailResponse(Guid UserId, string Email, string AccessToken, UserRole Role);

public class VerifyEmailEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPatch("/api/users/verify-email", async (VerifyEmailRequest request, ISender sender) =>
        {
            var command = request.Adapt<VerifyEmailCommand>();
            var result = await sender.Send(command);
            var response = result.Adapt<VerifyEmailResponse>();
            return Results.Ok(ApiResult.Success(response, "Email verified successfully"));
        });
    }
}
