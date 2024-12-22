namespace GameService.API.Features.Quizzes.Queries.GetQuizById;

public record GetQuizByIdRequest(Guid Id);
public record GetQuizByIdResponse(Quiz Quiz);


public class GetQuizByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/quizzes/{id:guid}", async ([FromRoute] Guid id, [FromServices] ISender sender) =>
        {
            var request = new GetQuizByIdRequest(id);
            var query = request.Adapt<GetQuizByIdQuery>();

            var result = await sender.Send(query);

            var response = result.Adapt<GetQuizByIdResponse>();

            return Results.Ok(ApiResult.Success(response.Quiz));
        });
    }
}
