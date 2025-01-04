namespace UserService.Application.Features.Users.Commands.VerifyEmail;

public record VerifyEmailCommand(string Email, string OtpCode) : ICommand<VerifyEmailResult>;
public record VerifyEmailResult(Guid UserId, string Email, string AccessToken);
