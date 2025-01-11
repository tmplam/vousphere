namespace UserService.Application.Features.Users.Queries.CheckUserRemainTurn;

internal sealed class CheckUserRemainTurnHandler(
    IPlayerRepository _playerRepository) : IQueryHandler<CheckUserRemainTurnQuery, bool>
{
    public async Task<bool> Handle(CheckUserRemainTurnQuery query, CancellationToken cancellationToken)
    {
        var user = await _playerRepository.FirstOrDefaultAsync(x => x.UserId == query.UserId);

        return user == null ? false : user.NumberOfPlays > 0;
    }
}
