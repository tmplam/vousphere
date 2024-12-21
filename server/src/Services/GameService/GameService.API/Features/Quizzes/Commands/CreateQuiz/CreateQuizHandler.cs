using BuildingBlocks.Auth.Services;

namespace GameService.API.Features.Quizzes.Commands.CreateQuiz;


public record CreateQuizCommand(string Name, string Description) : ICommand<CreateQuizResult>;
public record CreateQuizResult(Guid QuizId);


public class CreateQuizHandler(
    IDocumentSession session,
    IClaimService claimService) 
    : ICommandHandler<CreateQuizCommand, CreateQuizResult>
{
    public async Task<CreateQuizResult> Handle(CreateQuizCommand command, CancellationToken cancellationToken)
    {
        var quiz = new Quiz
        {
            BrandId = Guid.Parse(claimService.GetUserId()),
            Name = command.Name,
            Description = command.Description,
        };

        session.Store(quiz);
        await session.SaveChangesAsync(cancellationToken);

        return new CreateQuizResult(quiz.Id);
    }
}
