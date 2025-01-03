namespace EmailService.API.Options;

public class EmailSenderOptions
{
    public string ApiKey { get; init; } = string.Empty;
    public string SenderEmail { get; init; } = string.Empty;
    public string SenderName { get; init; } = string.Empty;
}
