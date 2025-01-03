using EmailService.API.Options;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace EmailService.API.Services;

public class EmailSenderService : IEmailSenderService
{
    private readonly EmailSenderOptions _emailSenderOptions;
    private readonly SendGridClient? _sendGridClient;

    public EmailSenderService(IOptions<EmailSenderOptions> emailOptions)
    {
        _emailSenderOptions = emailOptions.Value;
        if (!string.IsNullOrWhiteSpace(emailOptions.Value.ApiKey))
        {
            _sendGridClient = new SendGridClient(emailOptions.Value.ApiKey);
        }
    }

    public async Task SendEmailAsync(string to, string subject, string plainTextContent, string htmlContent, CancellationToken cancellationToken = default)
    {
        if (_sendGridClient == null)
        {
            throw new Exception("The SendGrid key is not provided");
        }

        EmailAddress fromAddress = new(_emailSenderOptions.SenderEmail, _emailSenderOptions.SenderName);
        EmailAddress toAddress = new(to);

        var msg = MailHelper.CreateSingleEmail(fromAddress, toAddress, subject, plainTextContent, htmlContent);
        await _sendGridClient.SendEmailAsync(msg, cancellationToken);
    }
}
