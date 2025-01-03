namespace EmailService.API.Services;

public interface IEmailSenderService
{
    Task SendEmailAsync(string to, string subject, string plainTextContent, string htmlContent, CancellationToken cancellationToken = default);
}
