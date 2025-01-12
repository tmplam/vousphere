using BuildingBlocks.Auth.Enums;
using BuildingBlocks.Auth.Services;
using Mapster;
using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.SearchPlayers;

internal sealed class SearchPlayersHandler(
    IUserRepository _userRepository,
    IClaimService _claimService) : IQueryHandler<SearchPlayersQuery, SearchPlayersResult>
{
    public async Task<SearchPlayersResult> Handle(SearchPlayersQuery query, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_claimService.GetUserId());

        var users = await _userRepository.GetUsersAsync(
            u => (string.IsNullOrWhiteSpace(query.Keyword) || u.Email.Contains(query.Keyword) || u.PhoneNumber.Contains(query.Keyword)) &&
                 u.Role == UserRole.Player &&
                 u.Id != userId,
            1,
            5);

        var userDtos = users.Data.ToList().Adapt<List<UserDto>>();

        return new SearchPlayersResult(userDtos);
    }
}
