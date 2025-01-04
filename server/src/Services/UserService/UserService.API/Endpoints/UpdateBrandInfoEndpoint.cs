using BuildingBlocks.Auth.Constants;
using UserService.Application.Features.Users.Commands.UpdateBrandInfo;

namespace UserService.API.Endpoints;

public record UpdateBrandInfoRequest(
    string Name,
    string PhoneNumber,
    double Latitude,
    double Longitude,
    string Address,
    string Domain);

public class UpdateBrandInfoEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/api/brands/brand-info", async (
            UpdateBrandInfoRequest request,
            ISender sender) =>
        {
            var command = request.Adapt<UpdateBrandInfoCommand>();
            var result = await sender.Send(command);
            return Results.NoContent();
        })
            .RequireAuthorization(AuthPolicy.Brand);
    }
}
