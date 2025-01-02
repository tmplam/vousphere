using System.Linq.Expressions;

namespace UserService.Application.Repositories;

public interface IUserRepository
{
    Task<User?> FirstOrDefaultAsync(Expression<Func<User, bool>> predicate, bool? includePlayer = null);
    Task<User> AddAsync(User user);
}
