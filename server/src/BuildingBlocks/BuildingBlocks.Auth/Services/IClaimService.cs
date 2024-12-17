namespace BuildingBlocks.Auth.Services;

public interface IClaimService
{
    string GetUserId();
    string? GetClaim(string key);
}
