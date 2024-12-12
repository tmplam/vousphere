namespace BuildingBlocks.Auth.Abstractions.Services;

public interface IJwtProvider
{
    string GenerateToken(AuthUser user);
}
