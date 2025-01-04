namespace UserService.Application.Features.Users.Commands.ResendOtp;

public record ResendOtpCommand(string Email) : ICommand<ResendOtpResult>;
public record ResendOtpResult();

public class ResendOtpCommandValidator : AbstractValidator<ResendOtpCommand>
{
    public ResendOtpCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email is invalid");
    }
}