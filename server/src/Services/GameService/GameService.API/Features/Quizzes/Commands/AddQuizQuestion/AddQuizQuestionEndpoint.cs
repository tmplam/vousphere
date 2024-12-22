namespace GameService.API.Features.Quizzes.Commands.AddQuizQuestion;

public record AddQuizQuestionRequest(string Content, List<QuestionOptionDto> Options);
public record AddQuizQuestionResponse(Guid QuestionId);


public class AddQuizQuestionEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/quizzes/{id:guid}/questions", async (
            [FromRoute] Guid id,
            [FromBody] AddQuizQuestionRequest request,
            [FromServices] ISender sender) =>
        {
            var command = new AddQuizQuestionCommand(id, request.Content, request.Options);

            var result = await sender.Send(command);

            var response = result.Adapt<AddQuizQuestionResponse>();

            return Results.Created(
                $"/game-service/quizzes/{id}/questions/{response.QuestionId}",
                ApiResult.Success(response, "Question added", StatusCodes.Status201Created));
        })
            .RequireAuthorization(AuthPolicy.BrandOrAdmin);
    }
}
