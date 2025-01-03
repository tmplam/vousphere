namespace UserService.Application.Features.Users.Queries.GetBrandInfo;

internal sealed class GetBrandInfoHandler(
    IBrandRepository _brandRepository)
    : IQueryHandler<GetBrandInfoQuery, GetBrandInfoResult>
{
    public async Task<GetBrandInfoResult> Handle(GetBrandInfoQuery query, CancellationToken cancellationToken)
    {
        var brand = await _brandRepository.FirstOrDefaultAsync(x => x.UserId == query.BrandId);
        return new GetBrandInfoResult(brand);
    }
}
