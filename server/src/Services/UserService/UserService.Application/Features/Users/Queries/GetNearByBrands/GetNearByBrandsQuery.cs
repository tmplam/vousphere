using BuildingBlocks.Shared;
using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.GetNearByBrands;

public record GetNearByBrandsQuery(
    double Latitude = 0,
    double Longitude = 0,
    double Radius = 0,
    int Page = 1,
    int PerPage = 10) : IQuery<GetNearByBrandsResult>;
public record GetNearByBrandsResult(PaginationResult<UserDto> Brands);
