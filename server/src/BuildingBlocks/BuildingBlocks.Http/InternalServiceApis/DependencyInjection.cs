using BuildingBlocks.Http.Options;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Refit;

namespace BuildingBlocks.Http.InternalServiceApis;

public static class DependencyInjection
{
    public static IServiceCollection AddMediaServiceClient(this IServiceCollection services)
    {
        services.AddRefitClient<IMediaApi>()
            .ConfigureHttpClient((serviceProvider, client) =>
            {
                var options = serviceProvider.GetRequiredService<IOptions<InternalServiceOptions>>().Value;
                client.BaseAddress = new Uri(options.MediaBaseUrl);
            });
        return services;
    }
}
