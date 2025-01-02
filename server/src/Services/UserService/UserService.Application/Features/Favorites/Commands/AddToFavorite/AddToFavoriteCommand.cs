namespace UserService.Application.Features.Favorites.Commands.AddToFavorite;

public record AddToFavoriteCommand(Guid EventId) : ICommand<AddToFavoriteResult>;
public record AddToFavoriteResult();

public class AddToFavoriteCommandValidator : AbstractValidator<AddToFavoriteCommand>
{
    public AddToFavoriteCommandValidator()
    {
        RuleFor(x => x.EventId)
            .NotEmpty().WithMessage("Event id is required.");
    }
}