namespace BuildingBlocks.Messaging.IntegrationEvents;

public class IntegrationEvent
{
    public Guid Id { get; init; } = Guid.NewGuid();

    public DateTimeOffset OccurredOn { get; init; } = DateTimeOffset.UtcNow;

    public string EventType => GetType().AssemblyQualifiedName!;
}
