using BuildingBlocks.Messaging.IntegrationEvents;
using EmailService.API.Services;
using MassTransit;

namespace EmailService.API.IntegrationEventHandlers;

public class SendEmailIntegrationEventHandler(
    IEmailSenderService _emailSenderService) 
    : IConsumer<SendEmailIntegrationEvent>
{
    public async Task Consume(ConsumeContext<SendEmailIntegrationEvent> context)
    {
        await _emailSenderService.SendEmailAsync(
            context.Message.To,
            context.Message.Subject,
            context.Message.PlainTextContent,
            context.Message.HtmlContent);
    }
}
