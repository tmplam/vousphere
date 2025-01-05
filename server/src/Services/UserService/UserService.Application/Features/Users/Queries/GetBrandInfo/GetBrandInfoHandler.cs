using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.GetBrandInfo;

internal sealed class GetBrandInfoHandler(
    IUserRepository _userRepository)
    : IQueryHandler<GetBrandInfoQuery, GetBrandInfoResult>
{
    public async Task<GetBrandInfoResult> Handle(GetBrandInfoQuery query, CancellationToken cancellationToken)
    {
        var user = await _userRepository.FirstOrDefaultAsync(x => x.Id == query.BrandId, includeBrand: true);

        var brandInfo = new BrandInfoDto();
        brandInfo.BrandId = query.BrandId;

        if (user != null)
        {
            brandInfo.Name = user.Name;
            brandInfo.Latitude = user.Brand?.Latitude;
            brandInfo.Longitude = user.Brand?.Longitude;
            brandInfo.Address = user.Brand?.Address ?? string.Empty;
            brandInfo.Domain = user.Brand?.Domain ?? string.Empty;
        }

        return new GetBrandInfoResult(brandInfo);
    }
}
