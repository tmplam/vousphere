namespace UserService.Application.Features.Users.Commands.ResendOtp;

public record ResendOtpCommand(string Email) : ICommand<ResendOtpResult>;
public record ResendOtpResult();
