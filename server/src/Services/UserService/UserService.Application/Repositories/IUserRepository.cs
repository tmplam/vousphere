using System.Linq.Expressions;
using UserService.Domain.Entities;

namespace UserService.Application.Repositories;

public interface IUserRepository
{
    Task<User?> FirstOrDefaultAsync(Expression<Func<User, bool>> predicate, bool? includePlayer = null);
    Task<User> AddAsync(User user);
}
