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
    IDocumentSession session)
    : ICommandHandler<RejectEventCommand, RejectEventResult>
{
    public async Task<RejectEventResult> Handle(RejectEventCommand command, CancellationToken cancellationToken)
    {
        var existingEvent = await session.LoadAsync<Event>(command.EventId);

        if (existingEvent == null) throw new NotFoundException("Event not found");

        if (existingEvent.Status == EventStatus.Happening || existingEvent.Status == EventStatus.Ended)
            throw new BadRequestException("Event is already happening or ended");

        existingEvent.Status = EventStatus.Rejected;
        existingEvent.Comment = command.Comment;

        session.Update(existingEvent);
        await session.SaveChangesAsync();

        return new RejectEventResult();
    }
}
