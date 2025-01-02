namespace EventService.API.Events.Commands.ApproveEvent;

public record ApproveEventCommand(Guid EventId) : ICommand<ApproveEventResult>;
public record ApproveEventResult();


public class ApproveEventHandler(
    IDocumentSession session)
    : ICommandHandler<ApproveEventCommand, ApproveEventResult>
{
    public async Task<ApproveEventResult> Handle(ApproveEventCommand command, CancellationToken cancellationToken)
    {
        var existingEvent = await session.LoadAsync<Event>(command.EventId);

        if (existingEvent == null) throw new NotFoundException("Event not found");

        existingEvent.Status = EventStatus.Approved;
        existingEvent.Comment = null;

        session.Update(existingEvent);
        await session.SaveChangesAsync();

        return new ApproveEventResult();
    }
}
