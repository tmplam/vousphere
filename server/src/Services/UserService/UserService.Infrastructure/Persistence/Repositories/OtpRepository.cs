using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using UserService.Application.Repositories;
using UserService.Domain.Entities;

namespace UserService.Infrastructure.Persistence.Repositories;

public class OtpRepository(ApplicationDbContext _dbContext) : IOtpRepository
{
    public async Task<Otp> AddAsync(Otp otp)
    {
        var entry = await _dbContext.Set<Otp>().AddAsync(otp);
        return entry.Entity;
    }

    public async Task<Otp?> FirstOrDefaultAsync(Expression<Func<Otp, bool>> predicate)
    {
        return await _dbContext.Set<Otp>().FirstOrDefaultAsync(predicate);
    }
}
