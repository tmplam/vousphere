using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.GetBrandInfo;

public record GetBrandInfoQuery(Guid BrandId) : IQuery<GetBrandInfoResult>;
public record GetBrandInfoResult(BrandInfoDto Brand);
