using BuildingBlocks.Shared;
using Carter;
using Mapster;
using MediatR;
using UserService.Application.Features.Users.Commands.SignUp;

namespace UserService.API.Endpoints.Users;

public record SignUpRequest(string PhoneNumber, string Password, bool IsBrand = false);
public record SignUpResponse(Guid UserId);

public class SignUp : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/users/sign-up", async (SignUpRequest request, ISender sender) =>
        {
            var command = request.Adapt<SignUpCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<SignUpResponse>();

            return Results.Ok(ApiResult.Success(response, "Sign up successfully"));
        });
    }
}
