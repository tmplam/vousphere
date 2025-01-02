using BuildingBlocks.Auth.Services;

namespace UserService.Application.Features.Users.Queries.SignIn;

internal sealed class SignInHandler(
    IUserRepository _userRepository,
    IPasswordService _passwordService,
    IJwtProvider _jwtProvider)
    : IQueryHandler<SignInQuery, SignInResult>
{
    public async Task<SignInResult> Handle(SignInQuery query, CancellationToken cancellationToken)
    {
        var user = await _userRepository.FirstOrDefaultAsync(user => user.PhoneNumber == query.PhoneNumber);
        if (user is null)
        {
            throw new BadRequestException($"Account with phone number \"{query.PhoneNumber}\" not existed.");
        }

        if (_passwordService.VerifyPassword(user, query.Password))
        {
            var token = _jwtProvider.GenerateToken(user);
            return new SignInResult(token);
        }

        throw new BadRequestException($"Password not match");
    }
}
