using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.GetProfile;

public record GetProfileQuery() : IQuery<GetProfileResult>;
public record GetProfileResult(UserDto User);