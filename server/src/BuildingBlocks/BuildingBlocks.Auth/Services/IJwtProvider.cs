namespace BuildingBlocks.Auth.Services;

public interface IJwtProvider
{
    string GenerateToken(AuthUser user);
}
