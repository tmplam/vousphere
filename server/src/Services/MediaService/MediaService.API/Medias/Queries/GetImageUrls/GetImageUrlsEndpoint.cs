namespace MediaService.API.Medias.Queries.GetImageUrls;

public record GetImageUrlsResponse(Dictionary<Guid, string> ImageUrls);


public class GetImageUrlsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/medias/image-urls", async (
            [FromBody] List<Guid> imageIds,
            [FromServices] ISender sender) =>
        {
            var query = new GetImageUrlsQuery(imageIds);

            var result = await sender.Send(query);

            var response = result.Adapt<GetImageUrlsResponse>();

            return Results.Ok(response.ImageUrls);
        });
    }
}
