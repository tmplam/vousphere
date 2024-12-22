using BuildingBlocks.Auth.Middlewares;
using BuildingBlocks.Auth.PayloadAuth;
using BuildingBlocks.Auth.Policies;
using BuildingBlocks.Exceptions.Handlers;
using Carter;
using Microsoft.AspNetCore.Authentication;

namespace UserService.API;

public static class DependencyInjection
{
    public static IServiceCollection AddApiServices(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddCarter();
        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = PayloadDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = PayloadDefaults.AuthenticationScheme;
            })
            .AddScheme<AuthenticationSchemeOptions, PayloadAuthenticationHandler>(PayloadDefaults.AuthenticationScheme, options => { });
        services.AddAuthorization(ConfigurePolicies.AddAllPolicies);
        services.AddExceptionHandler<GlobalExceptionhandler>();

        return services;
    }

    public static WebApplication UseApiServices(this WebApplication app)
    {
        app.UseExceptionHandler(options => { });

        app.UseRouting();
        
        app.UseAuthentication();

        app.UseAuthorization();

        app.MapCarter();

        return app;
    }
}
