namespace UserService.Application.Features.Users.Commands.ToggleBlockUser;

public record ToggleBlockUserCommand(Guid UserId) : ICommand<ToggleBlockUserResult>;
public record ToggleBlockUserResult(Guid UserId, string Message);

public class ToggleBlockUserCommandValidator : AbstractValidator<ToggleBlockUserCommand>
{
    public ToggleBlockUserCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId is required");
    }
}