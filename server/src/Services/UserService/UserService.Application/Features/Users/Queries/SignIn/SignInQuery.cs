using BuildingBlocks.Auth.Enums;

namespace UserService.Application.Features.Users.Queries.SignIn;

public record SignInQuery(string Email, string Password) : IQuery<SignInResult>;
public record SignInResult(string AccessToken, UserRole Role);