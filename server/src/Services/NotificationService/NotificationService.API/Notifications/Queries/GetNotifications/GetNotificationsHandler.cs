using BuildingBlocks.Shared;
using Marten.Pagination;

namespace NotificationService.API.Notifications.Queries.GetNotifications;

public record GetNotificationsQuery(int Page = 1, int PerPage = 5) : IQuery<GetNotificationsResult>;
public record GetNotificationsResult(PaginationResult<Notification> Notifications);

internal sealed class GetNotificationsHandler(
    IDocumentSession _session,
    IClaimService _claimService) : IQueryHandler<GetNotificationsQuery, GetNotificationsResult>
{
    public async Task<GetNotificationsResult> Handle(GetNotificationsQuery query, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_claimService.GetUserId());
        var role = Enum.Parse<UserRole>(_claimService.GetClaim(ClaimTypes.Role)!);

        var notificationsQuery = _session.Query<Notification>()
            .Where(n => (role == UserRole.Admin && n.UserId == Guid.Empty) || n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt);

        var notifications = await notificationsQuery.ToPagedListAsync(query.Page, query.PerPage, cancellationToken);

        return new GetNotificationsResult(
            PaginationResult<Notification>.Create(
                notifications.PageNumber,
                notifications.PageSize,
                notifications.TotalItemCount,
                notifications.PageCount,
                notifications));
    }
}