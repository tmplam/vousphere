using BuildingBlocks.Auth.Abstractions.Middlewares;
using BuildingBlocks.Auth.OptionsSetup;
using BuildingBlocks.Exceptions.Handlers;
using Carter;

namespace UserService.API;

public static class DependencyInjection
{
    public static IServiceCollection AddApiServices(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddCarter();
        services.AddAuthorization();
        services.AddExceptionHandler<GlobalExceptionhandler>();

        return services;
    }

    public static WebApplication UseApiServices(this WebApplication app)
    {
        app.UseRouting();
        
        app.UseMiddleware<UserFromHeaderMiddleware>();

        app.UseAuthorization();

        app.MapCarter();

        app.UseExceptionHandler(options => { });

        return app;
    }
}
