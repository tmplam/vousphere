namespace UserService.Application.Features.Favorites.Queries.GetFavoriteUserIds;

internal sealed class GetFavoriteUserIdsHandler(
    IUserFavoriteRepository _userFavoriteRepository) 
    : IQueryHandler<GetFavoriteUserIdsQuery, GetFavoriteUserIdsResult>
{
    public async Task<GetFavoriteUserIdsResult> Handle(GetFavoriteUserIdsQuery query, CancellationToken cancellationToken)
    {
        var userFavorites = await _userFavoriteRepository.GetAllUserFavoritesAsync(uf => uf.EventId == query.EventId);

        return new GetFavoriteUserIdsResult(userFavorites.Select(uf => uf.UserId));
    }
}
