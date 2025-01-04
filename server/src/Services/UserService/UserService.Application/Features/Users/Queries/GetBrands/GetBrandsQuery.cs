using BuildingBlocks.Shared;
using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.GetBrands;

public record GetBrandsQuery(
    int Page = 1,
    int PerPage = 10,
    string Keyword = "") : IQuery<GetBrandsResult>;
public record GetBrandsResult(PaginationResult<UserDto> Brands);
