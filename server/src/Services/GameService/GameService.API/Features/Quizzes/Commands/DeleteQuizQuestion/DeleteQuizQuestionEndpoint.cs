namespace GameService.API.Features.Quizzes.Commands.DeleteQuizQuestion;

public class DeleteQuizQuestionEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/quizzes/{quizId:guid}/questions/{questionId:guid}", async (
            [FromRoute] Guid quizId,
            [FromRoute] Guid questionId,
            [FromServices] ISender sender) =>
        {
            var command = new DeleteQuizQuestionCommand(quizId, questionId);

            var result = await sender.Send(command);

            return Results.NoContent();
        })
            .RequireAuthorization(AuthPolicy.BrandOrAdmin);
    }
}
