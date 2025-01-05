using BuildingBlocks.Auth.Enums;
using UserService.Application.Features.Users.Queries.SignIn;

namespace UserService.API.Endpoints;

public record SignInRequest(string Email, string Password);
public record SignInResponse(string AccessToken, UserRole Role);

public class SignInEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/users/sign-in", async (SignInRequest request, ISender sender) =>
        {
            var query = request.Adapt<SignInQuery>();

            var result = await sender.Send(query);

            var response = result.Adapt<SignInResponse>();

            return Results.Ok(ApiResult.Success(response, "Sign in successfully"));
        });
    }
}
