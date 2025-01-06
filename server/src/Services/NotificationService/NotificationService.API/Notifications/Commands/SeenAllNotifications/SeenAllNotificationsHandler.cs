using Marten.Patching;

namespace NotificationService.API.Notifications.Commands.SeenAllNotifications;

public record SeenAllNotificationsCommand() : ICommand<SeenAllNotificationsResult>;
public record SeenAllNotificationsResult();

internal sealed class SeenAllNotificationsHandler(
    IDocumentSession _session,
    IClaimService _claimService) : ICommandHandler<SeenAllNotificationsCommand, SeenAllNotificationsResult>
{
    public async Task<SeenAllNotificationsResult> Handle(SeenAllNotificationsCommand command, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_claimService.GetUserId());
        var role = Enum.Parse<UserRole>(_claimService.GetClaim(ClaimTypes.Role)!);

        _session.Patch<Notification>(n => 
            (role != UserRole.Admin && n.UserId == userId) || 
            (role == UserRole.Admin && n.UserId == Guid.Empty))
            .Set(x => x.IsSeen, true);

        await _session.SaveChangesAsync();

        return new SeenAllNotificationsResult();
    }
}
