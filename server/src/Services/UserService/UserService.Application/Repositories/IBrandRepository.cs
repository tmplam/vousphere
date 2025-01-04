using System.Linq.Expressions;

namespace UserService.Application.Repositories;

public interface IBrandRepository
{
    Task<Brand?> FirstOrDefaultAsync(Expression<Func<Brand, bool>> predicate, bool includeUser = false);
    Task<List<Brand>> GetAllAsync(Expression<Func<Brand, bool>>? predicate = null);
}
