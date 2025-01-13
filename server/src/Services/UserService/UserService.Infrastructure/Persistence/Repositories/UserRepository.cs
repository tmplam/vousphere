using BuildingBlocks.Auth.Enums;
using BuildingBlocks.Shared;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using UserService.Application.Repositories;
using UserService.Domain.Entities;
using UserService.Domain.Enums;

namespace UserService.Infrastructure.Persistence.Repositories;

public class UserRepository(ApplicationDbContext _dbContext) : IUserRepository
{
    public async Task<User?> FirstOrDefaultAsync(Expression<Func<User, bool>> predicate, bool includePlayer = false, bool includeBrand = false)
    {
        if (includePlayer)
            return await _dbContext.Set<User>().Include(u => u.Player).FirstOrDefaultAsync(predicate);
        else if (includeBrand)
            return await _dbContext.Set<User>().Include(user => user.Brand).FirstOrDefaultAsync(predicate);
        return await _dbContext.Set<User>().FirstOrDefaultAsync(predicate);
    }

    public async Task<User> AddAsync(User user)
    {
        var entry = await _dbContext.Set<User>().AddAsync(user);
        return entry.Entity;
    }

    public async Task<PaginationResult<User>> GetUsersAsync(
        Expression<Func<User, bool>> predicate, 
        int page = 1, 
        int perPage = 5,
        bool includePlayer = false,
        bool includeBrand = false)
    {
        var query = _dbContext.Set<User>().Where(predicate);
        var total = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(total / (double)perPage);

        if (includePlayer)
            query = query.Include(user => user.Player);
        if (includeBrand)
            query = query.Include(user => user.Brand);

        var data = await query.Skip((page - 1) * perPage).Take(perPage).ToListAsync();

        return PaginationResult<User>.Create(page, perPage, total, totalPages, data);
    }

    public async Task<PaginationResult<User>> GetBrandsAsync(Expression<Func<User, bool>> predicate, int page = 1, int perPage = 5)
    {
        var query = _dbContext.Set<User>()
            .Where(u => u.Role == UserRole.Brand && u.Status == UserStatus.Verified)
            .Include(user => user.Brand)
            .Where(predicate);

        var total = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(total / (double)perPage);
        var data = await query.Skip((page - 1) * perPage).Take(perPage).ToListAsync();

        return PaginationResult<User>.Create(page, perPage, total, totalPages, data);
    }

    public async Task<long> CountAsync(Expression<Func<User, bool>> predicate)
    {
        return await _dbContext.Set<User>().LongCountAsync(predicate);
    }
}
