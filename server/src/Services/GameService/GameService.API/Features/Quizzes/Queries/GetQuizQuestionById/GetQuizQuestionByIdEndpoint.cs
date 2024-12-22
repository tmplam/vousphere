namespace GameService.API.Features.Quizzes.Queries.GetQuizQuestionById;

public record GetQuizQuestionByIdResponse(Question Question);

public class GetQuizQuestionByIdEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/quizzes/{quizId:guid}/questions/{questionId:guid}", async (
            [FromRoute] Guid quizId,
            [FromRoute] Guid questionId,
            [FromServices] ISender sender) =>
        {
            var query = new GetQuizQuestionByIdQuery(quizId, questionId);

            var result = await sender.Send(query);

            var response = result.Adapt<GetQuizQuestionByIdResponse>();

            return Results.Ok(ApiResult.Success(response.Question));
        })
            .RequireAuthorization();
    }
}
