using UserService.Application.Features.Users.Commands.UpdateBrandInfo;

namespace UserService.API.Endpoints;

public record UpdateBrandInfoRequest(
    double Latitude,
    double Longitude,
    string Address,
    string Domain);

public class UpdateBrandInfoEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/api/brands/{brandId:guid}", async (
            Guid brandId,
            UpdateBrandInfoRequest request,
            ISender sender) =>
        {
            var command = new UpdateBrandInfoCommand(
                brandId,
                request.Latitude,
                request.Longitude,
                request.Address,
                request.Domain);
            var result = await sender.Send(command);
            return Results.NoContent();
        });
    }
}
