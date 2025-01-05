using BuildingBlocks.Auth.Enums;

namespace UserService.Application.Features.Users.Commands.VerifyEmail;

public record VerifyEmailCommand(string Email, string OtpCode) : ICommand<VerifyEmailResult>;
public record VerifyEmailResult(Guid UserId, string Email, string AccessToken, UserRole Role);

public class VerifyEmailCommandValidator : AbstractValidator<VerifyEmailCommand>
{
    public VerifyEmailCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email is invalid");

        RuleFor(x => x.OtpCode)
            .NotEmpty().WithMessage("OtpCode is required");
    }
}