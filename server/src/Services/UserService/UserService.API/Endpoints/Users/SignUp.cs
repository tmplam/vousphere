using Carter;

namespace UserService.API.Endpoints.Users;

public record SignUpOrderRequest();
public record SignUpResponse(Guid Id);

public class SignUp : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        
    }
}
