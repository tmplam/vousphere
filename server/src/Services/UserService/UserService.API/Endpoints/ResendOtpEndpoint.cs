using UserService.Application.Features.Users.Commands.ResendOtp;

namespace UserService.API.Endpoints;

public record ResendOtpRequest(string Email);

public class ResendOtpEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/users/resend-otp", async (ResendOtpRequest request, ISender sender) =>
        {
            var command = request.Adapt<ResendOtpCommand>();
            var result = await sender.Send(command);
            return Results.NoContent();
        });
    }
}
