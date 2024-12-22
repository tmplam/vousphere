namespace GameService.API.Features.Quizzes.Commands.UpdateQuiz;

public record UpdateQuizRequest(string Name, string Description);
public record UpdateQuizResponse(Guid QuizId);

public class UpdateQuizEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPatch("/quizzes/{quizId:guid}", async (
            [FromRoute] Guid quizId,
            [FromBody] UpdateQuizRequest request,
            [FromServices] ISender sender) =>
        {
            var command = new UpdateQuizCommand(quizId, request.Name, request.Description);

            var result = await sender.Send(command);

            var response = result.Adapt<UpdateQuizResponse>();

            return Results.Ok(ApiResult.Success(response, "Quiz updated"));
        });
    }
}
