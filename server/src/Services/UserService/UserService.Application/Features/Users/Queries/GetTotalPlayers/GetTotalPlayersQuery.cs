namespace UserService.Application.Features.Users.Queries.GetTotalPlayers;

public record GetTotalPlayersQuery() : IQuery<GetTotalPlayersResult>;
public record GetTotalPlayersResult(long TotalPlayers);
