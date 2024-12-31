using BuildingBlocks.Http.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace BuildingBlocks.Http.OptionsSetup;

public class InternalServiceOptionsSetup : IConfigureOptions<InternalServiceOptions>
{
    private const string SectionName = "InternalServices";
    private readonly IConfiguration _configuration;

    public InternalServiceOptionsSetup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void Configure(InternalServiceOptions options)
    {
        _configuration.GetSection(SectionName).Bind(options);
    }
}
