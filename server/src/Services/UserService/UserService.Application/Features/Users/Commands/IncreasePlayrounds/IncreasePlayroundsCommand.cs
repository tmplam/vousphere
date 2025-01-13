namespace UserService.Application.Features.Users.Commands.IncreasePlayrounds;

public record IncreasePlayroundsCommand(int NumberOfPlayrounds) : ICommand<IncreasePlayroundsResult>;
public record IncreasePlayroundsResult();

public class IncreasePlayroundsCommandValidator : AbstractValidator<IncreasePlayroundsCommand>
{
    public IncreasePlayroundsCommandValidator()
    {
        RuleFor(x => x.NumberOfPlayrounds)
            .GreaterThan(0).WithMessage("Number of playrounds must be greater than 0");
    }
}