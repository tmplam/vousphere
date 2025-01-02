using BuildingBlocks.Shared;
using System.Linq.Expressions;

namespace UserService.Application.Repositories;

public interface IUserFavoriteRepository
{
    Task<UserFavorite?> FirstOrDefaultAsync(Expression<Func<UserFavorite, bool>> predicate);
    Task<PaginationResult<UserFavorite>> GetUserFavoritesAsync(Expression<Func<UserFavorite, bool>> predicate, int page = 1, int perPage = 5);
    Task<UserFavorite> AddAsync(UserFavorite userFavorite);
    void Delete(UserFavorite userFavorite);
}
