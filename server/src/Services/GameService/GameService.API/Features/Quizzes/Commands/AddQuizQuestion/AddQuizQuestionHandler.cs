using BuildingBlocks.Exceptions;

namespace GameService.API.Features.Quizzes.Commands.AddQuizQuestion;

public record AddQuizQuestionCommand(Guid QuizId, string Content, List<QuestionOptionDto> Options) : ICommand<AddQuizQuestionResult>;
public record AddQuizQuestionResult(Guid QuestionId);

public class CreateQuizCommandValidator : AbstractValidator<AddQuizQuestionCommand>
{
    public CreateQuizCommandValidator()
    {
        RuleFor(q => q.Content)
            .NotEmpty().WithMessage("Question content is requied");

        RuleFor(q => q.Options)
            .NotEmpty().WithMessage("Question requires at least 1 option");

        RuleFor(q => q.Options)
            .Must(options => options.Any(o => o.IsCorrect))
            .WithMessage("At least one option is correct.");

        RuleForEach(q => q.Options).ChildRules(option =>
        {
            option.RuleFor(o => o.Content)
                .NotEmpty().WithMessage("Option content is required");
        });
    }
}


public class AddQuizQuestionHandler(
    IDocumentSession session,
    IClaimService claimService) 
    : ICommandHandler<AddQuizQuestionCommand, AddQuizQuestionResult>
{
    public async Task<AddQuizQuestionResult> Handle(AddQuizQuestionCommand command, CancellationToken cancellationToken)
    {
        var quiz = await session.LoadAsync<Quiz>(command.QuizId);

        if (quiz == null) throw new NotFoundException("Quiz not found");

        var brandId = Guid.Parse(claimService.GetUserId());

        if (brandId != quiz.BrandId) throw new ForbiddenException();

        var question = new Question
        {
            Id = Guid.NewGuid(),
            Content = command.Content,
            Options = command.Options.Select(o => new QuestionOption 
                {
                    Id = Guid.NewGuid(),
                    Content = o.Content,
                    IsCorrect = o.IsCorrect,
                }).ToList()
        };

        quiz.Questions.Add(question);
        session.Update(quiz);
        await session.SaveChangesAsync();

        return new AddQuizQuestionResult(question.Id);
    }
}
