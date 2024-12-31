namespace MediaService.API.Medias.Queries.GetImageUrlById;

public record GetImageUrlByIdResponse(string ImageUrl);

public class GetImageUrlByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/medias/{imageId}/image-url", async (
            [FromRoute] Guid imageId, 
            [FromServices] ISender sender) =>
        {
            var query = new GetImageUrlByIdQuery(imageId);

            var result = await sender.Send(query);

            var response = result.Adapt<GetImageUrlByIdResponse>();

            return Results.Ok(response.ImageUrl);
        });
    }
}
