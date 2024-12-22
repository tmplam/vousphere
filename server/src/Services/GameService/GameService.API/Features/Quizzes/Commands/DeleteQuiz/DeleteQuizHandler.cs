namespace GameService.API.Features.Quizzes.Commands.DeleteQuiz;

public record DeleteQuizCommand(Guid QuizId) : ICommand<DeleteQuizResult>;
public record DeleteQuizResult();


public class DeleteQuizHandler(
    IDocumentSession session,
    IClaimService claimService)
    : ICommandHandler<DeleteQuizCommand, DeleteQuizResult>
{
    public async Task<DeleteQuizResult> Handle(DeleteQuizCommand command, CancellationToken cancellationToken)
    {
        var quiz = await session.LoadAsync<Quiz>(command.QuizId);

        if (quiz == null) throw new NotFoundException("Quiz not found");

        var brandId = Guid.Parse(claimService.GetUserId());

        if (brandId != quiz.BrandId) throw new ForbiddenException();

        session.Delete(quiz);
        await session.SaveChangesAsync();

        return new DeleteQuizResult();
    }
}
