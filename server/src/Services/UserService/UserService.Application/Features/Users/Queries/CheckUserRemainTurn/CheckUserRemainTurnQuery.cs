namespace UserService.Application.Features.Users.Queries.CheckUserRemainTurn;

public record CheckUserRemainTurnQuery(Guid UserId) : IQuery<bool>;