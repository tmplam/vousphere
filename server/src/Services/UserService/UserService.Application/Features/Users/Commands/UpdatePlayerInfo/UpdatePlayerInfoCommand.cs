namespace UserService.Application.Features.Users.Commands.UpdatePlayerInfo;

public record UpdatePlayerInfoCommand(
    string Name,
    string PhoneNumber,
    DateOnly DateOfBirth,
    string Gender) : ICommand<UpdatePlayerInfoResult>;

public record UpdatePlayerInfoResult();

public class UpdatePlayerInfoCommandValidator : AbstractValidator<UpdatePlayerInfoCommand>
{
    public UpdatePlayerInfoCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required")
            .Matches(@"^\d{7,14}$").WithMessage("Phone number is not valid");

        RuleFor(x => x.DateOfBirth)
            .NotEmpty().WithMessage("Date of birth is required");

        RuleFor(x => x.Gender)
            .NotEmpty().WithMessage("Gender is required");   
    }
}