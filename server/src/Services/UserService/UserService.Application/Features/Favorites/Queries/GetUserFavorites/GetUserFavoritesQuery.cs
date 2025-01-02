using BuildingBlocks.Http.Dtos.Events;
using BuildingBlocks.Shared;

namespace UserService.Application.Features.Favorites.Queries.GetUserFavorites;

public record GetUserFavoritesQuery(int Page = 1, int PerPage = 10) : IQuery<GetUserFavoritesResult>;
public record GetUserFavoritesResult(PaginationResult<FavoriteEventDto> UserFavorites);
