namespace UserService.Application.Features.Favorites.Queries.GetFavoriteUserIds;

public record GetFavoriteUserIdsQuery(Guid EventId) : IQuery<GetFavoriteUserIdsResult>;
public record GetFavoriteUserIdsResult(IEnumerable<Guid> UserIds);
