using System.Linq.Expressions;

namespace UserService.Application.Repositories;

public interface IOtpRepository
{
    Task<Otp?> FirstOrDefaultAsync(Expression<Func<Otp, bool>> predicate);
    Task<Otp> AddAsync(Otp otp);
}
