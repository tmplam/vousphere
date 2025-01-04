using UserService.Domain.Enums;

namespace UserService.Application.Features.Users.Commands.UpdateBrandInfo;

internal sealed class UpdateBrandInfoHandler(
    IBrandRepository _brandRepository,
    IUnitOfWork _unitOfWork) : ICommandHandler<UpdateBrandInfoCommand, UpdateBrandInfoResult>
{
    public async Task<UpdateBrandInfoResult> Handle(UpdateBrandInfoCommand command, CancellationToken cancellationToken)
    {
        var brand = await _brandRepository.FirstOrDefaultAsync(b => b.UserId == command.BrandId, includeUser: true);

        if (brand is null) 
            throw new NotFoundException(nameof(Brand), command.BrandId);

        brand.Latitude = command.Latitude;
        brand.Longitude = command.Longitude;
        brand.Address = command.Address;
        brand.Domain = command.Domain;

        if (brand.User != null && brand.User.Status == UserStatus.UpdateInfoRequired)
            brand.User.Status = UserStatus.Verified;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new UpdateBrandInfoResult();
    }
}
