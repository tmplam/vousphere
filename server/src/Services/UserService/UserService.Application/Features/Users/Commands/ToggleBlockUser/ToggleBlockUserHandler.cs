using UserService.Domain.Enums;

namespace UserService.Application.Features.Users.Commands.ToggleBlockUser;

internal sealed class ToggleBlockUserHandler(
    IUserRepository _userRepository,
    IUnitOfWork _unitOfWork) : ICommandHandler<ToggleBlockUserCommand, ToggleBlockUserResult>
{
    public async Task<ToggleBlockUserResult> Handle(ToggleBlockUserCommand command, CancellationToken cancellationToken)
    {
        var user = await _userRepository.FirstOrDefaultAsync(u => u.Id == command.UserId);

        if (user is null)
            throw new NotFoundException(nameof(User), command.UserId);

        if (user.Status == UserStatus.Created || user.Status == UserStatus.UpdateInfoRequired)
            throw new BadRequestException("Can't block unverified user");

        var result = new ToggleBlockUserResult(user.Id, "Account blocked successfully");
        if (user.Status == UserStatus.Blocked)
        {
            user.Status = UserStatus.Verified;
            result = new ToggleBlockUserResult(user.Id, "Account unblocked successfully");
        }
        else if (user.Status == UserStatus.Verified)
        {
            user.Status = UserStatus.Blocked;
        }

        await _unitOfWork.SaveChangesAsync();

        return result;
    }
}
