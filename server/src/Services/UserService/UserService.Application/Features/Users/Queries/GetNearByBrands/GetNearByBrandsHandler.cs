using BuildingBlocks.Http.InternalServiceApis;
using BuildingBlocks.Shared;
using Mapster;
using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.GetNearByBrands;

internal sealed class GetNearByBrandsHandler(
    IUserRepository _userRepository,
    IMediaApi _mediaService) : IQueryHandler<GetNearByBrandsQuery, GetNearByBrandsResult>
{
    public async Task<GetNearByBrandsResult> Handle(GetNearByBrandsQuery query, CancellationToken cancellationToken)
    {
        var users = await _userRepository.GetBrandsAsync(
            u =>
                u.Brand != null &&
                u.Brand.Latitude.HasValue && 
                u.Brand.Longitude.HasValue &&
                Math.Pow(query.Latitude - u.Brand.Latitude.Value, 2) 
                    + Math.Pow(query.Longitude - u.Brand.Longitude.Value, 2) < Math.Pow(query.Radius, 2),
            page: query.Page,
            perPage: query.PerPage);

        var userDtos = users.Data.ToList().Adapt<List<UserDto>>();

        var imageIds = userDtos.Select(u => u.ImageId);

        var imageUrlsDictionary = await _mediaService.GetImageUrlsAsync(imageIds);

        foreach (var userDto in userDtos)
        {
            if (imageUrlsDictionary.TryGetValue(userDto.ImageId, out var eventImageUrl))
            {
                userDto.Image = eventImageUrl;
            }
        }

        return new GetNearByBrandsResult(
            PaginationResult<UserDto>.Create(
                users.Page,
                users.PerPage,
                users.Total,
                users.TotalPage,
                userDtos));
    }
}
