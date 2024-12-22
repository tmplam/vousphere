namespace GameService.API.Features.Quizzes.Commands.UpdateQuizQuestion;

public record UpdateQuizQuestionRequest(string Content, List<QuestionOptionDto> Options);
public record UpdateQuizQuestionResponse(Guid QuestionId);

public class UpdateQuizQuestionEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("/quizzes/{quizId:guid}/questions/{questionId:guid}", async (
            [FromRoute] Guid quizId,
            [FromRoute] Guid questionId,
            [FromBody] UpdateQuizQuestionRequest request, 
            [FromServices] ISender sender) =>
        {
            var command = new UpdateQuizQuestionCommand(quizId, questionId, request.Content, request.Options);

            var result = await sender.Send(command);

            var response = result.Adapt<UpdateQuizQuestionResponse>();

            return Results.Ok(ApiResult.Success(response, "Question updated"));
        })
            .RequireAuthorization(AuthPolicy.BrandOrAdmin);
    }
}
