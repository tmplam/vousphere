using EmailService.API.Options;
using Microsoft.Extensions.Options;

namespace EmailService.API.OptionsSetup;

public class EmailSenderOptionsSetup : IConfigureOptions<EmailSenderOptions>
{
    private const string SectionName = "SendgridEmailService";
    private readonly IConfiguration _configuration;

    public EmailSenderOptionsSetup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void Configure(EmailSenderOptions options)
    {
        _configuration.GetSection(SectionName).Bind(options);
    }
}
