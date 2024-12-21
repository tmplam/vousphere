using BuildingBlocks.Auth.Constants;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace BuildingBlocks.Auth.Middlewares;

public class UserToHeaderMiddleware
{
    private readonly RequestDelegate _next;

    public UserToHeaderMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.User?.Identity?.IsAuthenticated ?? false)
        {
            var userClaims = context.User.Claims.Select(c => new
            {
                c.Type,
                c.Value
            });

            var claimsJson = JsonSerializer.Serialize(userClaims);

            context.Request.Headers["X-User-Claims"] = claimsJson;
        }

        await _next(context);
    }
}
