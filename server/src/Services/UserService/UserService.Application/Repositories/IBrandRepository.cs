using System.Linq.Expressions;

namespace UserService.Application.Repositories;

public interface IBrandRepository
{
    Task<Brand?> FirstOrDefaultAsync(Expression<Func<Brand, bool>> predicate);
    Task<List<Brand>> GetAllAsync(Expression<Func<Brand, bool>>? predicate = null);
}
