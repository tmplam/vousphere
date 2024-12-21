namespace GameService.API.Features.Quizzes.Commands.CreateQuiz;

public record CreateQuizRequest(string Name, string Description);
public record CreateQuizResponse(Guid QuizId);


public class CreateQuizEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/quizzes", async ([FromBody] CreateQuizRequest request, [FromServices] ISender sender) =>
        {
            var command = request.Adapt<CreateQuizCommand>();

            var result = await sender.Send(command);

            var response = result.Adapt<CreateQuizResponse>();

            return Results.Created(
                $"/game-service/quizzes/{response.QuizId}", 
                ApiResult.Success(response, "Quiz created", StatusCodes.Status201Created));
        })
            .RequireAuthorization(AuthPolicy.BrandOrAdmin);
    }
}
