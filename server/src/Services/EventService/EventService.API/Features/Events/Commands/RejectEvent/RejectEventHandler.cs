namespace EventService.API.Features.Events.Commands.RejectEvent;

public record RejectEventCommand(Guid EventId, string Comment) : ICommand<RejectEventResult>;
public record RejectEventResult();


public class RejectEventHandler(
    IDocumentSession session)
    : ICommandHandler<RejectEventCommand, RejectEventResult>
{
    public async Task<RejectEventResult> Handle(RejectEventCommand command, CancellationToken cancellationToken)
    {
        var existingEvent = await session.LoadAsync<Event>(command.EventId);

        if (existingEvent == null) throw new NotFoundException("Event not found");

        existingEvent.Status = EventStatus.Approved;
        existingEvent.Comment = command.Comment;

        session.Update(existingEvent);
        await session.SaveChangesAsync();

        return new RejectEventResult();
    }
}
