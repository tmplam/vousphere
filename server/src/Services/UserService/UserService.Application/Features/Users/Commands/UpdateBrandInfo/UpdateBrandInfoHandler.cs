using BuildingBlocks.Auth.Services;
using UserService.Domain.Enums;

namespace UserService.Application.Features.Users.Commands.UpdateBrandInfo;

internal sealed class UpdateBrandInfoHandler(
    IUserRepository _userRepository,
    IClaimService _claimService,
    IUnitOfWork _unitOfWork) : ICommandHandler<UpdateBrandInfoCommand, UpdateBrandInfoResult>
{
    public async Task<UpdateBrandInfoResult> Handle(UpdateBrandInfoCommand command, CancellationToken cancellationToken)
    {
        var brandId = Guid.Parse(_claimService.GetUserId());

        var brand = await _userRepository.FirstOrDefaultAsync(b => b.Id == brandId, includeBrand: true);

        if (brand is null) 
            throw new NotFoundException(nameof(Brand), brandId);

        brand.Name = command.Name;
        brand.PhoneNumber = command.PhoneNumber;

        if (brand.Brand == null)
            brand.Brand = new Brand();

        brand.Brand.Latitude = command.Latitude;
        brand.Brand.Longitude = command.Longitude;
        brand.Brand.Address = command.Address;
        brand.Brand.Domain = command.Domain;

        if (brand.Status == UserStatus.UpdateInfoRequired)
            brand.Status = UserStatus.Verified;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new UpdateBrandInfoResult();
    }
}
