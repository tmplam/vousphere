namespace NotificationService.API.Notifications.Commands.DeleteNotification;

public record DeleteNotificationCommand(Guid NotificationId) : ICommand<DeleteNotificationResult>;
public record  DeleteNotificationResult();


public class DeleteNotificationHandler(
    IDocumentSession _session,
    IClaimService _claimService)
    : ICommandHandler<DeleteNotificationCommand, DeleteNotificationResult>
{
    public async Task<DeleteNotificationResult> Handle(DeleteNotificationCommand command, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_claimService.GetUserId());
        var role = Enum.Parse<UserRole>(_claimService.GetClaim(ClaimTypes.Role)!);

        var notification = await _session.LoadAsync<Notification>(command.NotificationId);

        if (notification == null)
            throw new NotFoundException("Notification not found");

        if ((notification.UserId == Guid.Empty && role != UserRole.Admin) ||
            (notification.UserId != Guid.Empty && notification.UserId != userId))
            throw new ForbiddenException("You are not allowed to toggle this notification");

        _session.Delete(notification);
        await _session.SaveChangesAsync();

        return new DeleteNotificationResult();
    }
}
