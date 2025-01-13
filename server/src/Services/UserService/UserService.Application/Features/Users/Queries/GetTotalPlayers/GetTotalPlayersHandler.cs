using BuildingBlocks.Auth.Enums;

namespace UserService.Application.Features.Users.Queries.GetTotalPlayers;

internal sealed class GetTotalPlayersHandler(
    IUserRepository _userRepository) : IQueryHandler<GetTotalPlayersQuery, GetTotalPlayersResult>
{
    public async Task<GetTotalPlayersResult> Handle(GetTotalPlayersQuery query, CancellationToken cancellationToken)
    {
        var totalPlayers = await _userRepository.CountAsync(x => x.Role == UserRole.Player);
        return new GetTotalPlayersResult(totalPlayers);
    }
}
