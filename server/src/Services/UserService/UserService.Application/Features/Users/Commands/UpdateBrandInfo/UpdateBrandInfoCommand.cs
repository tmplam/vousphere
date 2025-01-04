namespace UserService.Application.Features.Users.Commands.UpdateBrandInfo;

public record UpdateBrandInfoCommand(
    string Name,
    string PhoneNumber,
    double Latitude,
    double Longitude,
    string Address,
    string Domain) : ICommand<UpdateBrandInfoResult>;
public record UpdateBrandInfoResult();

public class UpdateBrandInfoCommandValidator : AbstractValidator<UpdateBrandInfoCommand>
{
    public UpdateBrandInfoCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required")
            .Matches(@"^\d{7,14}$").WithMessage("Phone number is not valid");

        RuleFor(x => x.Latitude)
            .NotEmpty().WithMessage("Latitude is required");

        RuleFor(x => x.Longitude)
            .NotEmpty().WithMessage("Longitude is required");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address is required");

        RuleFor(x => x.Domain)
            .NotEmpty().WithMessage("Domain is required");
    }
}