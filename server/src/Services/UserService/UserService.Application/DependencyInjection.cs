using BuildingBlocks.Behaviors;
using BuildingBlocks.Http.InternalServiceApis;
using BuildingBlocks.Http.OptionsSetup;
using Microsoft.Extensions.DependencyInjection;

namespace UserService.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(AssemblyReference.Assembly, includeInternalTypes: true);

        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(AssemblyReference.Assembly);
            config.AddOpenBehavior(typeof(ValidationPipelineBehavior<,>));
        });

        // Servives configuration
        services.ConfigureOptions<InternalServiceOptionsSetup>();

        services.AddEventServiceClient();

        return services;
    }
}
