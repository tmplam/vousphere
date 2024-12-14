using Carter;

namespace UserService.API.Endpoints.Users;

public record SignInOrderRequest();
public record SignInResponse(Guid Id);

public class SignIn : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/sign-in", () =>
        {
            return "sign-in";
        });
    }
}
