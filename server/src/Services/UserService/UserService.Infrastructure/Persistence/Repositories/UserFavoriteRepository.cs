using BuildingBlocks.Shared;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using UserService.Application.Repositories;
using UserService.Domain.Entities;

namespace UserService.Infrastructure.Persistence.Repositories;

public class UserFavoriteRepository(ApplicationDbContext _dbContext) : IUserFavoriteRepository
{
    public async Task<UserFavorite> AddAsync(UserFavorite userFavorite)
    {
        var entry = await _dbContext.Set<UserFavorite>().AddAsync(userFavorite);
        return entry.Entity;
    }

    public void Delete(UserFavorite userFavorite)
    {
        _dbContext.Set<UserFavorite>().Remove(userFavorite);
    }

    public async Task<UserFavorite?> FirstOrDefaultAsync(Expression<Func<UserFavorite, bool>> predicate)
    {
        return await _dbContext.Set<UserFavorite>().FirstOrDefaultAsync(predicate);
    }

    public async Task<PaginationResult<UserFavorite>> GetUserFavoritesAsync(Expression<Func<UserFavorite, bool>> predicate, int page = 1, int perPage = 5)
    {
        var query = _dbContext.Set<UserFavorite>().Where(predicate);
        var total = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(total / (double)perPage);
        var data = await query.Skip((page - 1) * perPage).Take(perPage).ToListAsync();

        return PaginationResult<UserFavorite>.Create(page, perPage, total, totalPages, data);
    }
}
