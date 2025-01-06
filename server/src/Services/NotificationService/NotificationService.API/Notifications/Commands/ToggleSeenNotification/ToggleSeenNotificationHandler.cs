namespace NotificationService.API.Notifications.Commands.ToggleSeenNotification;

public record ToggleSeenNotificationCommand(Guid NotificationId) : ICommand<ToggleSeenNotificationResult>;
public record ToggleSeenNotificationResult();


internal sealed class ToggleSeenNotificationHandler(
    IDocumentSession _session,
    IClaimService _claimService) 
    : ICommandHandler<ToggleSeenNotificationCommand, ToggleSeenNotificationResult>
{
    public async Task<ToggleSeenNotificationResult> Handle(ToggleSeenNotificationCommand command, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_claimService.GetUserId());
        var role = Enum.Parse<UserRole>(_claimService.GetClaim(ClaimTypes.Role)!);

        var notification = await _session.LoadAsync<Notification>(command.NotificationId);

        if (notification == null)
            throw new NotFoundException("Notification not found");

        if ((notification.UserId == Guid.Empty && role != UserRole.Admin) || 
            (notification.UserId != Guid.Empty && notification.UserId != userId))
            throw new ForbiddenException("You are not allowed to toggle this notification");

        notification.IsSeen = !notification.IsSeen;
        _session.Update(notification);
        await _session.SaveChangesAsync();

        return new ToggleSeenNotificationResult();
    }
}
