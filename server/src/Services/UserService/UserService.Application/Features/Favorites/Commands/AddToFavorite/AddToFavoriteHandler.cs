using BuildingBlocks.Auth.Services;
using BuildingBlocks.Http.InternalServiceApis;

namespace UserService.Application.Features.Favorites.Commands.AddToFavorite;


internal sealed class AddToFavoriteHandler(
    IUserFavoriteRepository _userFavoriteRepository,
    IUnitOfWork _unitOfWork,
    IClaimService _claimService,
    IEventApi _eventService) : ICommandHandler<AddToFavoriteCommand, AddToFavoriteResult>
{
    public async Task<AddToFavoriteResult> Handle(AddToFavoriteCommand command, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_claimService.GetUserId());

        var existedUserFavorite = await _userFavoriteRepository
            .FirstOrDefaultAsync(userFavorite => userFavorite.UserId == userId && userFavorite.EventId == command.EventId);

        if (existedUserFavorite != null) throw new BadRequestException("Event already in favorite list.");

        var isValidEvent = await _eventService.CheckEventExistsAsync(command.EventId);

        if (!isValidEvent) throw new NotFoundException("Event not found.");

        var userFavorite = new UserFavorite
        {
            UserId = userId,
            EventId = command.EventId,
        };

        userFavorite = await _userFavoriteRepository.AddAsync(userFavorite);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new AddToFavoriteResult();
    }
}
