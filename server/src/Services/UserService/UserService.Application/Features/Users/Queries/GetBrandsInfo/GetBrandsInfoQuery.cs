using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.GetBrandsInfo;

public record GetBrandsInfoQuery(IEnumerable<Guid> BrandIds) : IQuery<GetBrandsInfoResult>;
public record GetBrandsInfoResult(Dictionary<Guid, BrandInfoDto> Brands);