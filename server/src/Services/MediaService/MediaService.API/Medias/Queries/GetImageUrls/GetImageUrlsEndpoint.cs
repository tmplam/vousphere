namespace MediaService.API.Medias.Queries.GetImageUrls;

public record GetImageUrlsRequest(List<Guid> ImageIds);
public record GetImageUrlsResponse(Dictionary<Guid, string> ImageUrls);


public class GetImageUrlsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/medias/image-urls", async (
            [FromBody] GetImageUrlsRequest request,
            [FromServices] ISender sender) =>
        {
            var query = request.Adapt<GetImageUrlsQuery>();

            var result = await sender.Send(query);

            var response = result.Adapt<GetImageUrlsResponse>();

            return Results.Ok(response);
        });
    }
}
