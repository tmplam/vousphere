using BuildingBlocks.Shared;
using Microsoft.AspNetCore.Mvc;

namespace MediaService.API.Medias.Commands.UploadImage;

public record UploadImageRequest(IFormFile File);
public record UploadImageResponse(Guid ImageId);


public class UploadImageEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/medias/upload-image", async (
            [FromForm] UploadImageRequest request,
            [FromServices] ISender sender) =>
        {
            var command = new UploadImageCommand(request.File);

            var result = await sender.Send(command);

            var response = result.Adapt<UploadImageResponse>();

            return Results.Ok(ApiResult.Success(response));
        })
            .DisableAntiforgery();
    }
}
