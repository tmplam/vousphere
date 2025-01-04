using BuildingBlocks.Http.InternalServiceApis;
using BuildingBlocks.Shared;
using Mapster;
using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.GetUsers;

internal sealed class GetUsersHandler(
    IUserRepository _userRepository,
    IMediaApi _mediaService)
    : IQueryHandler<GetUsersQuery, GetUsersResult>
{
    public async Task<GetUsersResult> Handle(GetUsersQuery query, CancellationToken cancellationToken)
    {
        var users = await _userRepository.GetUsersAsync(
            u => (string.IsNullOrWhiteSpace(query.Keyword) || u.Email.Contains(query.Keyword) || u.Name.Contains(query.Keyword)) &&
                 (!query.Role.HasValue || u.Role == query.Role),
            query.Page,
            query.PerPage);

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

        return new GetUsersResult(
            PaginationResult<UserDto>.Create(
                users.Page,
                users.PerPage,
                users.Total,
                users.TotalPage,
                userDtos));
    }
}
