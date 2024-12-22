namespace GameService.API.Features.Quizzes.Commands.DeleteQuizQuestion;

public record DeleteQuizQuestionCommand(Guid QuizId, Guid QuestionId) : ICommand<DeleteQuizQuestionResult>;
public record DeleteQuizQuestionResult();

public class DeleteQuizQuestionHandler(
    IDocumentSession session,
    IClaimService claimService) 
    : ICommandHandler<DeleteQuizQuestionCommand, DeleteQuizQuestionResult>
{
    public async Task<DeleteQuizQuestionResult> Handle(DeleteQuizQuestionCommand command, CancellationToken cancellationToken)
    {
        var quiz = await session.LoadAsync<Quiz>(command.QuizId);

        if (quiz == null) throw new NotFoundException("Quiz not found");

        var question = quiz.Questions.FirstOrDefault(q => q.Id == command.QuestionId);

        if (question == null) throw new NotFoundException("Question not found");

        var brandId = Guid.Parse(claimService.GetUserId());

        if (brandId != quiz.BrandId) throw new ForbiddenException();

        quiz.Questions.Remove(question);

        session.Update(quiz);
        await session.SaveChangesAsync();

        return new DeleteQuizQuestionResult();
    }
}
