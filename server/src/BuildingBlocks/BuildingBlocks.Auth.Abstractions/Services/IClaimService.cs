namespace BuildingBlocks.Auth.Abstractions.Services;

public interface IClaimService
{
    string GetUserId();
    string? GetClaim(string key);
}
