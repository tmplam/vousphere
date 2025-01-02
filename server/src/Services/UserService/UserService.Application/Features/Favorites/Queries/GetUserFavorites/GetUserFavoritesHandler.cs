using BuildingBlocks.Auth.Services;
using BuildingBlocks.Http.Dtos.Events;
using BuildingBlocks.Http.InternalServiceApis;
using BuildingBlocks.Shared;
using Mapster;

namespace UserService.Application.Features.Favorites.Queries.GetUserFavorites;

internal sealed class GetUserFavoritesHandler(
    IUserFavoriteRepository _userFavoriteRepository,
    IBrandRepository _brandRepository,
    IClaimService _claimService,
    IEventApi _eventService)
    : IQueryHandler<GetUserFavoritesQuery, GetUserFavoritesResult>
{
    public async Task<GetUserFavoritesResult> Handle(GetUserFavoritesQuery query, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_claimService.GetUserId());

        var userFavorites = await _userFavoriteRepository.GetUserFavoritesAsync(uf => uf.UserId == userId, query.Page, query.PerPage);

        var eventIds = userFavorites.Data.Select(uf => uf.EventId).ToList();

        var favoriteEvents = await _eventService.GetFavoriteEventsAsync(eventIds);

        var brandIds = favoriteEvents.Select(fe => fe.BrandId).Distinct().ToList();

        var brandsDictionary = (await _brandRepository.GetAllAsync(b => brandIds.Contains(b.UserId)))
            .ToDictionary(b => b.UserId, b => b);

        foreach (var favoriteEvent in favoriteEvents)
        {
            if (brandsDictionary.TryGetValue(favoriteEvent.BrandId, out var brand))
            {
                favoriteEvent.Brand = brand.Adapt<BrandDto>();
            }
        }

        var result = new PaginationResult<FavoriteEventDto>(
            userFavorites.Page, 
            userFavorites.PerPage,
            userFavorites.Total, 
            userFavorites.TotalPage,
            favoriteEvents);

        return new GetUserFavoritesResult(result);
    }
}
