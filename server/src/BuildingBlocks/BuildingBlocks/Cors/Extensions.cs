using Microsoft.Extensions.DependencyInjection;

namespace BuildingBlocks.Cors;

public static class Extensions
{
    public static IServiceCollection AddAllowAllCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials()
                    .SetIsOriginAllowed(host => true);
            });
        });
        return services;
    }
}
