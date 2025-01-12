using BuildingBlocks.Shared;
using System.Linq.Expressions;

namespace UserService.Application.Repositories;

public interface IUserRepository
{
    Task<User?> FirstOrDefaultAsync(Expression<Func<User, bool>> predicate, bool includePlayer = false, bool includeBrand = false);
    Task<User> AddAsync(User user);
    Task<PaginationResult<User>> GetUsersAsync(
        Expression<Func<User, bool>> predicate, 
        int page = 1, 
        int perPage = 5, 
        bool includePlayer = false,
        bool includeBrand = false);

    Task<PaginationResult<User>> GetBrandsAsync(
        Expression<Func<User, bool>> predicate,
        int page = 1,
        int perPage = 5);
}
