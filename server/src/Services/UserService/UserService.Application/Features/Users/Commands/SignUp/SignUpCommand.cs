namespace UserService.Application.Features.Users.Commands.SignUp;

public record SignUpCommand(string Email, string Name, string Password, bool IsBrand = false) : ICommand<SignUpResult>;
public record SignUpResult(Guid UserId, string Email);

public class SignUpCommandValidator : AbstractValidator<SignUpCommand>
{
    public SignUpCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email is invalid");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters");
    }
}