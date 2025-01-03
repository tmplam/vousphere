namespace BuildingBlocks.Messaging.IntegrationEvents;

public class SendEmailIntegrationEvent : IntegrationEvent
{
    public string To { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string HtmlContent { get; set; } = string.Empty;
    public string PlainTextContent { get; set; } = string.Empty;
}
