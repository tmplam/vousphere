namespace UserService.Application.Services;

public interface IOtpService
{
    Task<bool> VerifyOtpAsync(Guid userId, string otpCode);
    Task<Otp> GenerateOtpAsync(Guid userId);
}
