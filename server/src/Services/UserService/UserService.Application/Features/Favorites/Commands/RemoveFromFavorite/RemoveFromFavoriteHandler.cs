using BuildingBlocks.Auth.Services;

namespace UserService.Application.Features.Favorites.Commands.RemoveFromFavorite;

internal sealed class RemoveFromFavoriteHandler(
    IUserFavoriteRepository _userFavoriteRepository,
    IUnitOfWork _unitOfWork,
    IClaimService _claimService) : ICommandHandler<RemoveFromFavoriteCommand, RemoveFromFavoriteResult>
{
    public async Task<RemoveFromFavoriteResult> Handle(RemoveFromFavoriteCommand command, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_claimService.GetUserId());

        var existedUserFavorite = await _userFavoriteRepository
            .FirstOrDefaultAsync(userFavorite => userFavorite.UserId == userId && userFavorite.EventId == command.EventId);

        if (existedUserFavorite == null) throw new BadRequestException("Event not exists in favorite list.");

        _userFavoriteRepository.Delete(existedUserFavorite);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new RemoveFromFavoriteResult();
    }
}
