namespace NotificationService.API.Notifications.Queries.GetNotificationById;

public record GetNotificationByIdQuery(Guid NotificationId) : IQuery<GetNotificationByIdResult>;
public record GetNotificationByIdResult(Notification Notification);


public class GetNotificationByIdHandler(
    IDocumentSession _session,
    IClaimService _claimService)
    : IQueryHandler<GetNotificationByIdQuery, GetNotificationByIdResult>
{
    public async Task<GetNotificationByIdResult> Handle(GetNotificationByIdQuery query, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_claimService.GetUserId());
        var role = Enum.Parse<UserRole>(_claimService.GetClaim(ClaimTypes.Role)!);

        var notification = await _session.LoadAsync<Notification>(query.NotificationId);

        if (notification == null)
            throw new NotFoundException("Notification not found");

        if ((notification.UserId == Guid.Empty && role != UserRole.Admin) ||
            (notification.UserId != Guid.Empty && notification.UserId != userId))
            throw new ForbiddenException("You are not allowed to toggle this notification");

        return new GetNotificationByIdResult(notification);
    }
}
