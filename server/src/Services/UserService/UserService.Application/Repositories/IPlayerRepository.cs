using System.Linq.Expressions;

namespace UserService.Application.Repositories;

public interface IPlayerRepository
{
    Task<Player?> FirstOrDefaultAsync(Expression<Func<Player, bool>> predicate, bool includeUser = false);
}
