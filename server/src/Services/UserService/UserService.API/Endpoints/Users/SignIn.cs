using BuildingBlocks.Shared;
using Carter;
using Mapster;
using MediatR;
using UserService.Application.Features.Users.Queries.SignIn;

namespace UserService.API.Endpoints.Users;

public record SignInRequest(string PhoneNumber, string Password);
public record SignInResponse(string AccessToken);

public class SignIn : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/users/sign-in", async (SignInRequest request, ISender sender) =>
        {
            var query = request.Adapt<SignInQuery>();

            var result = await sender.Send(query);

            var response = result.Adapt<SignInResponse>();

            return Results.Ok(ApiResult.Success(response, "Sign in successfully"));
        });
    }
}
