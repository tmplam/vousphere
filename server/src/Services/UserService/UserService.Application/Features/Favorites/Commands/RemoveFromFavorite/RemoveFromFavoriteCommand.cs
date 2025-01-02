namespace UserService.Application.Features.Favorites.Commands.RemoveFromFavorite;

public record RemoveFromFavoriteCommand(Guid EventId) : ICommand<RemoveFromFavoriteResult>;
public record RemoveFromFavoriteResult();


public class RemoveFromFavoriteCommandValidator : AbstractValidator<RemoveFromFavoriteCommand>
{
    public RemoveFromFavoriteCommandValidator()
    {
        RuleFor(x => x.EventId)
            .NotEmpty().WithMessage("Event id is required.");
    }
}