namespace UserService.Application.Features.Users.Queries.GetBrandsInfo;

public record GetBrandsInfoQuery(IEnumerable<Guid> BrandIds) : IQuery<GetBrandsInfoResult>;
public record GetBrandsInfoResult(Dictionary<Guid, Brand> Brands);