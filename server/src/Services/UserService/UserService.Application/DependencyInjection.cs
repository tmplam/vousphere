using BuildingBlocks.Behaviors;
using FluentValidation;
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
        return services;
    }
}
