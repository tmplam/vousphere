using BuildingBlocks.Auth.Abstractions.Services;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace BuildingBlocks.Auth.Services;

public class ClaimService(IHttpContextAccessor _httpContextAccessor) : IClaimService
{
    public string? GetClaim(string key) => _httpContextAccessor.HttpContext?.User.FindFirst(key)?.Value;

    public string GetUserId() => GetClaim(ClaimTypes.NameIdentifier)!;
}
