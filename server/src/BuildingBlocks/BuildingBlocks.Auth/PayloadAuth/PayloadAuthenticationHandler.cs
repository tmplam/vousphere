using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Text.Json;

namespace BuildingBlocks.Auth.PayloadAuth;


public class PayloadAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public PayloadAuthenticationHandler(IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder)
        : base(options, logger, encoder) { }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Context.Request.Headers.TryGetValue("X-User-Claims", out var claimsJson))
        {
            return Task.FromResult(AuthenticateResult.Fail("Missing X-User-Claims header"));
        }

        try
        {
            var claimsList = JsonSerializer.Deserialize<List<ClaimDto>>(claimsJson!)!;

            var claims = claimsList.Select(c => new Claim(c.Type, c.Value));

            var identity = new ClaimsIdentity(claims, PayloadDefaults.AuthenticationScheme);

            var user = new ClaimsPrincipal(identity);

            var ticket = new AuthenticationTicket(user, PayloadDefaults.AuthenticationScheme);

            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
        catch (JsonException ex)
        {
            Logger.LogError(ex, "Invalid JSON format in X-User-Claims header");
            return Task.FromResult(AuthenticateResult.Fail("Invalid X-User-Claims format"));
        }
    }

    protected override Task HandleChallengeAsync(AuthenticationProperties properties)
    {
        Context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        Context.Response.ContentType = "application/json";

        var responseBody = new
        {
            statusCode = StatusCodes.Status401Unauthorized,
            isSuccess = false,
            message = "Authentication failed"
        };

        return Context.Response.WriteAsync(JsonSerializer.Serialize(responseBody));
    }

    protected override Task HandleForbiddenAsync(AuthenticationProperties properties)
    {
        Context.Response.StatusCode = StatusCodes.Status403Forbidden;
        Context.Response.ContentType = "application/json";

        var responseBody = new
        {
            statusCode = StatusCodes.Status403Forbidden,
            isSuccess = false,
            message = "Forbidden resource"
        };

        return Context.Response.WriteAsync(JsonSerializer.Serialize(responseBody));
    }

    private class ClaimDto
    {
        public string Type { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
    }
}