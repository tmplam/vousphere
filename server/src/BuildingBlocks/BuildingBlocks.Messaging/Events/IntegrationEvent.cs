namespace BuildingBlocks.Messaging.Events;

public class IntegrationEvent
{
    public Guid Id { get; init; } = Guid.NewGuid();

    public DateTimeOffset OccurredOn { get; init; } = DateTimeOffset.UtcNow;

    public string EventType => GetType().AssemblyQualifiedName!;
}
