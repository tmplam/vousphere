namespace UserService.Application.Features.Users.Queries.GetBrandsInfo;

internal sealed class GetBrandsInfoHandler(
    IBrandRepository _brandRepository) 
    : IQueryHandler<GetBrandsInfoQuery, GetBrandsInfoResult>
{
    public async Task<GetBrandsInfoResult> Handle(GetBrandsInfoQuery query, CancellationToken cancellationToken)
    {
        var brands = (await _brandRepository.GetAllAsync(x => query.BrandIds.Contains(x.UserId)))
            .ToDictionary(b => b.UserId, b => new Dtos.BrandInfoDto
            {
                BrandId = b.UserId,
                Name = b.User?.Name ?? string.Empty,
                Latitude = b.Latitude,
                Longitude = b.Longitude,
                Address = b.Address ?? string.Empty,
                Domain = b.Domain ?? string.Empty
            });

        return new GetBrandsInfoResult(brands);
    }
}
