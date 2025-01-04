using BuildingBlocks.Auth.Enums;
using BuildingBlocks.Http.InternalServiceApis;
using BuildingBlocks.Shared;
using Mapster;
using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.GetBrands;

internal sealed class GetBrandsHandler(
    IUserRepository _userRepository,
    IMediaApi _mediaService) : IQueryHandler<GetBrandsQuery, GetBrandsResult>
{
    public async Task<GetBrandsResult> Handle(GetBrandsQuery query, CancellationToken cancellationToken)
    {
        var users = await _userRepository.GetUsersAsync(
            u => (string.IsNullOrWhiteSpace(query.Keyword) || u.Email.Contains(query.Keyword) || u.Name.Contains(query.Keyword)) &&
                u.Role == UserRole.Brand,
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

        return new GetBrandsResult(
            PaginationResult<UserDto>.Create(
                users.Page,
                users.PerPage,
                users.Total,
                users.TotalPage,
                userDtos));
    }
}
