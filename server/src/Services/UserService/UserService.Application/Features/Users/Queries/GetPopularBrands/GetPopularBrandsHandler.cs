using BuildingBlocks.Auth.Enums;
using BuildingBlocks.Http.InternalServiceApis;
using BuildingBlocks.Shared;
using Mapster;
using UserService.Application.Dtos;
using UserService.Domain.Enums;

namespace UserService.Application.Features.Users.Queries.GetPopularBrands;

internal sealed class GetPopularBrandsHandler(
    IUserRepository _userRepository,
    IMediaApi _mediaService) : IQueryHandler<GetPopularBrandsQuery, GetPopularBrandsResult>
{
    public async Task<GetPopularBrandsResult> Handle(GetPopularBrandsQuery query, CancellationToken cancellationToken)
    {
        var users = await _userRepository.GetUsersAsync(
            u => (string.IsNullOrWhiteSpace(query.Keyword) || u.Email.Contains(query.Keyword) || u.Name.Contains(query.Keyword)) &&
                u.Role == UserRole.Brand &&
                u.Status == UserStatus.Verified,
            page: query.Page,
            perPage: query.PerPage,
            includeBrand: true);

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

        return new GetPopularBrandsResult(
            PaginationResult<UserDto>.Create(
                users.Page,
                users.PerPage,
                users.Total,
                users.TotalPage,
                userDtos));
    }
}
