namespace BuildingBlocks.Auth.Abstractions.Services;

public interface IPasswordService
{
    public string HashPassword(AuthUser user, string password);
    public bool VerifyPassword(AuthUser user, string enteredPassword);
}
