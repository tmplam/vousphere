using BuildingBlocks.Auth.Services;
using UserService.Domain.Enums;

namespace UserService.Application.Features.Users.Queries.SignIn;

internal sealed class SignInHandler(
    IUserRepository _userRepository,
    IPasswordService _passwordService,
    IJwtProvider _jwtProvider)
    : IQueryHandler<SignInQuery, SignInResult>
{
    public async Task<SignInResult> Handle(SignInQuery query, CancellationToken cancellationToken)
    {
        var user = await _userRepository.FirstOrDefaultAsync(user => user.Email == query.Email);
        if (user is null)
        {
            throw new BadRequestException($"Account with email \"{query.Email}\" not existed");
        }

        if (user.Status == UserStatus.Created)
        {
            throw new BadRequestException($"Account with email \"{query.Email}\" not verified");
        }

        if (user.Status == UserStatus.Blocked)
        {
            throw new BadRequestException($"Account with email \"{query.Email}\" is blocked");
        }

        if (_passwordService.VerifyPassword(user, query.Password))
        {
            var token = _jwtProvider.GenerateToken(user);
            return new SignInResult(token, user.Role);
        }

        throw new BadRequestException($"Password not match");
    }
}
