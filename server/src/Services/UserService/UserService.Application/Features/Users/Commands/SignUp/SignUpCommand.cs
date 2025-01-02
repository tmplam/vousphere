namespace UserService.Application.Features.Users.Commands.SignUp;

public record SignUpCommand(string PhoneNumber, string Password, bool IsBrand = false) : ICommand<SignUpResult>;
public record SignUpResult(Guid UserId);

public class SignUpCommandValidator : AbstractValidator<SignUpCommand>
{
    public SignUpCommandValidator()
    {
        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required.")
            .Matches(@"^\d+$").WithMessage("Phone number must contain only digits.")
            .Length(10, 15).WithMessage("Phone number must be between 10 and 15 digits.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters.");
    }
}