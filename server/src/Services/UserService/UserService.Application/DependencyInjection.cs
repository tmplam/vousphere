using BuildingBlocks.Behaviors;
using BuildingBlocks.Http.InternalServiceApis;
using BuildingBlocks.Http.OptionsSetup;
using BuildingBlocks.Messaging.MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace UserService.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddValidatorsFromAssembly(AssemblyReference.Assembly, includeInternalTypes: true);

        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(AssemblyReference.Assembly);
            config.AddOpenBehavior(typeof(ValidationPipelineBehavior<,>));
        });

        // Add database and message broker
        services.AddMessageBroker(configuration, Assembly.GetExecutingAssembly());

        // Servives configuration
        services.ConfigureOptions<InternalServiceOptionsSetup>();

        services.AddEventServiceClient();
        services.AddMediaServiceClient();

        return services;
    }
}
