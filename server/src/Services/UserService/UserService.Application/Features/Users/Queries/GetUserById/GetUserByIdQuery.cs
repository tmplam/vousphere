using UserService.Application.Dtos;

namespace UserService.Application.Features.Users.Queries.GetUserById;

public record GetUserByIdQuery(Guid UserId) : IQuery<GetUserByIdResult>;
public record GetUserByIdResult(UserDto User);