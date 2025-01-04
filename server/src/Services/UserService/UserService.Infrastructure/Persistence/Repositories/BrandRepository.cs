using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using UserService.Application.Repositories;
using UserService.Domain.Entities;

namespace UserService.Infrastructure.Persistence.Repositories;

public class BrandRepository(ApplicationDbContext _dbContext) : IBrandRepository
{
    public async Task<Brand?> FirstOrDefaultAsync(Expression<Func<Brand, bool>> predicate, bool includeUser = false)
    {
        if (includeUser)
            return await _dbContext.Set<Brand>().Include(b => b.User).FirstOrDefaultAsync(predicate);
        return await _dbContext.Set<Brand>().FirstOrDefaultAsync(predicate);
    }

    public async Task<List<Brand>> GetAllAsync(Expression<Func<Brand, bool>>? predicate = null)
    {
        return predicate == null
            ? await _dbContext.Set<Brand>().ToListAsync()
            : await _dbContext.Set<Brand>().Where(predicate).ToListAsync();
    }
}
