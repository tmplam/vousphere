using BuildingBlocks.Auth.Services;

namespace UserService.Application.Features.Users.Commands.IncreasePlayrounds;

internal sealed class IncreasePlayroundsHandler(
    IPlayerRepository _playerRepository,
    IUnitOfWork _unitOfWork,
    IClaimService _claimService) : ICommandHandler<IncreasePlayroundsCommand, IncreasePlayroundsResult>
{
    public async Task<IncreasePlayroundsResult> Handle(IncreasePlayroundsCommand command, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_claimService.GetUserId());

        var player = await _playerRepository.FirstOrDefaultAsync(u => u.UserId == userId);

        if (player is null)
            throw new NotFoundException(nameof(Player), userId);
        
        player.NumberOfPlays += command.NumberOfPlayrounds;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new IncreasePlayroundsResult();
    }
}
