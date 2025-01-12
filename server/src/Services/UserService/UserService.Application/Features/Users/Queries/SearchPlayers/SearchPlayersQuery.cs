using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.SearchPlayers;

public record SearchPlayersQuery(
    string Keyword = "") : IQuery<SearchPlayersResult>;
public record SearchPlayersResult(List<UserDto> Players);
