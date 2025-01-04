using BuildingBlocks.Auth.Services;

namespace UserService.Application.Features.Users.Commands.UpdatePlayerInfo;

internal sealed class UpdatePlayerInfoHandler(
    IUserRepository _userRepository,
    IClaimService _claimService,
    IUnitOfWork _unitOfWork) : ICommandHandler<UpdatePlayerInfoCommand, UpdatePlayerInfoResult>
{
    public async Task<UpdatePlayerInfoResult> Handle(UpdatePlayerInfoCommand command, CancellationToken cancellationToken)
    {
        var playerId = Guid.Parse(_claimService.GetUserId());

        var player = await _userRepository.FirstOrDefaultAsync(u=> u.Id == playerId, includePlayer: true);

        if (player is null)
            throw new NotFoundException(nameof(User), playerId);

        player.Name = command.Name;
        player.PhoneNumber = command.PhoneNumber;

        if (player.Player is null)
            player.Player = new Player();
        player.Player.DateOfBirth = command.DateOfBirth;
        player.Player.Gender = command.Gender;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new UpdatePlayerInfoResult();
    }
}
