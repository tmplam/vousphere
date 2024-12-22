namespace GameService.API.Features.Quizzes.Commands.UpdateQuizQuestion;

public record UpdateQuizQuestionCommand(
    Guid QuizId,
    Guid QuestionId,
    string Content,
    List<QuestionOptionDto> Options) : ICommand<UpdateQuizQuestionResult>;
public record UpdateQuizQuestionResult(Guid QuestionId);

public class UpdateQuizCommandValidator : AbstractValidator<UpdateQuizQuestionCommand>
{
    public UpdateQuizCommandValidator()
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


public class UpdateQuizQuestionHandler(
    IDocumentSession session,
    IClaimService claimService)
    : ICommandHandler<UpdateQuizQuestionCommand, UpdateQuizQuestionResult>
{
    public async Task<UpdateQuizQuestionResult> Handle(UpdateQuizQuestionCommand command, CancellationToken cancellationToken)
    {
        var quiz = await session.LoadAsync<Quiz>(command.QuizId);

        if (quiz == null) throw new NotFoundException("Quiz not found");

        var brandId = Guid.Parse(claimService.GetUserId());

        if (brandId != quiz.BrandId) throw new ForbiddenException();

        var question = quiz.Questions.FirstOrDefault(q => q.Id == command.QuestionId);

        if (question == null) throw new NotFoundException("Question not found");

        
        question.Content = command.Content;
        foreach (var option in command.Options)
        {
            var existingOption = question.Options.FirstOrDefault(o => o.Id == option.Id);
            if (existingOption != null)
            {
                existingOption.Content = option.Content;
                existingOption.IsCorrect = option.IsCorrect;
            }
            else
            {
                option.Id = Guid.NewGuid();
                question.Options.Add(option.Adapt<QuestionOption>());
            }
        }

        question.Options.RemoveAll(o => command.Options.All(uo => uo.Id != o.Id));

        session.Update(quiz);
        await session.SaveChangesAsync();

        return new UpdateQuizQuestionResult(question.Id);
    }
}
