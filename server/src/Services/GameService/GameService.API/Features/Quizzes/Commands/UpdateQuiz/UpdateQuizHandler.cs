namespace GameService.API.Features.Quizzes.Commands.UpdateQuiz;

public record UpdateQuizCommand(Guid QuizId, string Name, string Description) : ICommand<UpdateQuizResult>;
public record UpdateQuizResult(Guid QuizId);

public class UpdateQuizCommandValidator : AbstractValidator<UpdateQuizCommand>
{
    public UpdateQuizCommandValidator()
    {
        RuleFor(q => q.Name)
            .NotEmpty().WithMessage("Quiz name is requied");

        RuleFor(q => q.Description)
            .NotEmpty().WithMessage("Quiz description is requied");
    }
}


public class UpdateQuizHandler(
    IDocumentSession session,
    IClaimService claimService) 
    : ICommandHandler<UpdateQuizCommand, UpdateQuizResult>
{
    public async Task<UpdateQuizResult> Handle(UpdateQuizCommand command, CancellationToken cancellationToken)
    {
        var quiz = await session.LoadAsync<Quiz>(command.QuizId);

        if (quiz == null) throw new NotFoundException("Quiz not found");

        var brandId = Guid.Parse(claimService.GetUserId());

        if (brandId != quiz.BrandId) throw new ForbiddenException();

        quiz.Name = command.Name;
        quiz.Description = command.Description;

        session.Update(quiz);
        await session.SaveChangesAsync();

        return new UpdateQuizResult(quiz.Id);
    }
}
