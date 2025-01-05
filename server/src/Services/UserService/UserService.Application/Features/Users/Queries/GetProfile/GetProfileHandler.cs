using BuildingBlocks.Auth.Enums;
using BuildingBlocks.Auth.Services;
using BuildingBlocks.Http.InternalServiceApis;
using Mapster;
using System.Security.Claims;
using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.GetProfile;

internal sealed class GetProfileHandler(
    IUserRepository _userRepository,
    IClaimService _claimService,
    IMediaApi _mediaService) : IQueryHandler<GetProfileQuery, GetProfileResult>
{
    public async Task<GetProfileResult> Handle(GetProfileQuery query, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_claimService.GetUserId());
        var role = Enum.Parse<UserRole>(_claimService.GetClaim(ClaimTypes.Role)!);

        var user = await _userRepository.FirstOrDefaultAsync(
            u => u.Id == userId, 
            includeBrand: role == UserRole.Brand, 
            includePlayer: role == UserRole.Player);

        if (user is null)
            throw new NotFoundException("User not found");

        var userDto = user.Adapt<UserDto>();

        if (userDto.ImageId != Guid.Empty)
        {
            userDto.Image = await _mediaService.GetImageUrlAsync(userDto.ImageId);
        }

        return new GetProfileResult(userDto);
    }
}
