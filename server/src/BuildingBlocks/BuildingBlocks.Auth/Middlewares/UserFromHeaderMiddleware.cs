using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using System.Text.Json;

namespace BuildingBlocks.Auth.Middlewares;

public class UserFromHeaderMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<UserFromHeaderMiddleware> _logger;

    public UserFromHeaderMiddleware(RequestDelegate next, ILogger<UserFromHeaderMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    
    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue("X-User-Claims", out var claimsJson))
        {
            try
            {
                var claimsList = JsonSerializer.Deserialize<List<ClaimDto>>(claimsJson!)!;

                var claims = claimsList.Select(c => new Claim(c.Type, c.Value));

                var identity = new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme);
                var user = new ClaimsPrincipal(identity);

                context.User = user;
            }
            catch (JsonException)
            {
                _logger.LogError("Invalid User Claims JSON format in X-User-Claims header.");
            }
        }

        await _next(context);
    }

    private class ClaimDto
    {
        public string Type { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
    }
}
