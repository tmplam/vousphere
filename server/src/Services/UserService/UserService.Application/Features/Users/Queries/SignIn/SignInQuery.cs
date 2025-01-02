namespace UserService.Application.Features.Users.Queries.SignIn;

public record SignInQuery(string PhoneNumber, string Password) : IQuery<SignInResult>;
public record SignInResult(string AccessToken);