using UserService.Application.Repositories;
using UserService.Application.Services;
using UserService.Domain.Entities;

namespace UserService.Infrastructure.Services;

public class OtpService : IOtpService
{
    private readonly IOtpRepository _otpRepository;

    public OtpService(IOtpRepository otpRepository)
    {
        _otpRepository = otpRepository;
    }

    public async Task<bool> VerifyOtpAsync(Guid userId, string otpCode)
    {
        var otp = await _otpRepository
            .FirstOrDefaultAsync(o => o.UserId == userId && o.Code == otpCode && o.ExpiresAt > DateTimeOffset.UtcNow);

        return otp != null;
    }

    public async Task<Otp> GenerateOtpAsync(Guid userId)
    {
        var otp = new Otp
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Code = GenerateOtpCode(),
            CreatedAt = DateTimeOffset.UtcNow,
            ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(5)
        };

        otp = await _otpRepository.AddAsync(otp);
        return otp;
    }

    private string GenerateOtpCode()
    {
        return new Random().Next(100000, 999999).ToString();
    }
}
