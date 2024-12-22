namespace GameService.API.Features.Quizzes.Commands.DeleteQuiz;

public class DeleteQuizEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("/quizzes/{quizId:guid}", async (
            [FromRoute] Guid quizId,
            [FromServices] ISender sender) =>
        {
            var command = new DeleteQuizCommand(quizId);

            var result = await sender.Send(command);

            return Results.NoContent();
        })
            .RequireAuthorization(AuthPolicy.BrandOrAdmin);
    }
}
