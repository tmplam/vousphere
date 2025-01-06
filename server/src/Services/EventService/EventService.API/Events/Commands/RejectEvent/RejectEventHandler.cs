using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;

namespace EventService.API.Events.Commands.RejectEvent;

public record RejectEventCommand(Guid EventId, string Comment) : ICommand<RejectEventResult>;
public record RejectEventResult();

public class RejectEventCommandValidator : AbstractValidator<RejectEventCommand>
{
    public RejectEventCommandValidator()
    {
        RuleFor(r => r.Comment)
            .NotEmpty().WithMessage("Reject comment is required");
    }
}

public class RejectEventHandler(
    IDocumentSession _session,
    IPublishEndpoint _publishEndpoint)
    : ICommandHandler<RejectEventCommand, RejectEventResult>
{
    public async Task<RejectEventResult> Handle(RejectEventCommand command, CancellationToken cancellationToken)
    {
        var existingEvent = await _session.LoadAsync<Entities.Event>(command.EventId);

        if (existingEvent == null) throw new NotFoundException("Event not found");

        if (existingEvent.Status == EventStatus.Happening)
            throw new BadRequestException("Event is already happening");

        if (existingEvent.Status == EventStatus.Ended)
            throw new BadRequestException("Event is already ended");

        if (existingEvent.Status == EventStatus.Rejected)
            throw new BadRequestException("Event is already rejected");

        existingEvent.Status = EventStatus.Rejected;
        existingEvent.Comment = command.Comment;

        _session.Update(existingEvent);

        // Send notification to the brand
        var eventApprovedEvent = new EventApprovedIntegrationEvent
        {
            EventId = existingEvent.Id,
            BrandId = existingEvent.BrandId,
            EventName = existingEvent.Name,
        };

        await Task.WhenAll(
            _session.SaveChangesAsync(),
            _publishEndpoint.Publish(eventApprovedEvent));

        return new RejectEventResult();
    }
}
