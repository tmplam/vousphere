using BuildingBlocks.Auth.Enums;
using BuildingBlocks.Shared;
using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.GetUsers;

public record GetUsersQuery(
    int Page = 1,
    int PerPage = 10,
    string Keyword = "",
    UserRole? Role = null) : IQuery<GetUsersResult>;
public record GetUsersResult(PaginationResult<UserDto> Users);
