using BuildingBlocks.Shared;
using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.GetPopularBrands;

public record GetPopularBrandsQuery(
    int Page = 1,
    int PerPage = 10,
    string Keyword = "") : IQuery<GetPopularBrandsResult>;
public record GetPopularBrandsResult(PaginationResult<UserDto> Brands);
