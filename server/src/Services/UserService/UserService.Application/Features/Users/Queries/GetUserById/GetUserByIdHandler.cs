using BuildingBlocks.Auth.Enums;
using BuildingBlocks.Http.InternalServiceApis;
using Mapster;
using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.GetUserById;

internal sealed class GetUserByIdHandler(
    IUserRepository _userRepository,
    IBrandRepository _brandRepository,
    IPlayerRepository _playerRepository,
    IMediaApi _mediaService) : IQueryHandler<GetUserByIdQuery, GetUserByIdResult>
{
    public async Task<GetUserByIdResult> Handle(GetUserByIdQuery query, CancellationToken cancellationToken)
    {
        var user = await _userRepository.FirstOrDefaultAsync(u => u.Id == query.UserId);

        if (user is null)
            throw new NotFoundException("User not found");

        if (user.Role == UserRole.Brand)
        {
            user.Brand = await _brandRepository.FirstOrDefaultAsync(b => b.UserId == user.Id);
        }
        else if (user.Role == UserRole.Player)
        {
            user.Player = await _playerRepository.FirstOrDefaultAsync(p => p.UserId == user.Id);
        }

        var userDto = user.Adapt<UserDto>();

        if (userDto.ImageId != Guid.Empty)
        {
            userDto.Image = await _mediaService.GetImageUrlAsync(userDto.ImageId);
        }

        return new GetUserByIdResult(userDto);
    }
}
