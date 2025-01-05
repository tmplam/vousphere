using BuildingBlocks.Auth.Enums;
using BuildingBlocks.Auth.Services;
using UserService.Application.Services;
using UserService.Domain.Enums;

namespace UserService.Application.Features.Users.Commands.VerifyEmail;

internal sealed class VerifyEmailHandler(
    IUserRepository _userRepository,
    IOtpService _otpService,
    IJwtProvider _jwtProvider,
    IUnitOfWork _unitOfWork)
    : ICommandHandler<VerifyEmailCommand, VerifyEmailResult>
{
    public async Task<VerifyEmailResult> Handle(VerifyEmailCommand command, CancellationToken cancellationToken)
    {
        var user = await _userRepository.FirstOrDefaultAsync(x => x.Email == command.Email);

        if (user == null)
            throw new NotFoundException("User", command.Email);

        if (user.Status == UserStatus.Verified || user.Status == UserStatus.Blocked)
            throw new BadRequestException("Email already verified");

        if (!await _otpService.VerifyOtpAsync(user.Id, command.OtpCode))
            throw new BadRequestException("Invalid OTP code");

        if (user.Role == UserRole.Brand)
            user.Status = UserStatus.UpdateInfoRequired;
        else
            user.Status = UserStatus.Verified;


        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var token = _jwtProvider.GenerateToken(user);

        return new VerifyEmailResult(user.Id, user.Email, token, user.Role);
    }
}
