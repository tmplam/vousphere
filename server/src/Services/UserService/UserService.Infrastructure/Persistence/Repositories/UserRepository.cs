using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using UserService.Application.Repositories;
using UserService.Domain.Entities;

namespace UserService.Infrastructure.Persistence.Repositories;

public class UserRepository(ApplicationDbContext _dbContext) : IUserRepository
{
    public async Task<User?> FirstOrDefaultAsync(Expression<Func<User, bool>> predicate, bool? includePlayer = null)
    {
        if (includePlayer == null)
            return await _dbContext.Set<User>().FirstOrDefaultAsync(predicate);
        else if (includePlayer is true)
            return await _dbContext.Set<User>().Include(user => user.Brand).FirstOrDefaultAsync(predicate);
        return await _dbContext.Set<User>().Include(user => user.Player).FirstOrDefaultAsync(predicate);
    }

    public async Task<User> AddAsync(User user)
    {
        var entry = await _dbContext.Set<User>().AddAsync(user);
        return entry.Entity;
    }
}
