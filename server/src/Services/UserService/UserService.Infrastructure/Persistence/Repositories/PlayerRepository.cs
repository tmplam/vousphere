using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using UserService.Application.Repositories;
using UserService.Domain.Entities;

namespace UserService.Infrastructure.Persistence.Repositories;

public class PlayerRepository(ApplicationDbContext _dbContext) : IPlayerRepository
{
    public async Task<Player?> FirstOrDefaultAsync(Expression<Func<Player, bool>> predicate, bool includeUser = false)
    {
        if (includeUser)
            return await _dbContext.Set<Player>().Include(b => b.User).FirstOrDefaultAsync(predicate);
        return await _dbContext.Set<Player>().FirstOrDefaultAsync(predicate);
    }
}
