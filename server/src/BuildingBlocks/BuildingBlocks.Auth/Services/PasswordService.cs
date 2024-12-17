using Microsoft.AspNetCore.Identity;

namespace BuildingBlocks.Auth.Services;

public class PasswordService(IPasswordHasher<AuthUser> _passwordHasher) : IPasswordService
{
    public string HashPassword(AuthUser user, string password)
    {
        return _passwordHasher.HashPassword(user, password);
    }

    public bool VerifyPassword(AuthUser user, string enteredPassword)
    {
        var result = _passwordHasher.VerifyHashedPassword(user, user.Password, enteredPassword);
        return result == PasswordVerificationResult.Success;
    }
}
