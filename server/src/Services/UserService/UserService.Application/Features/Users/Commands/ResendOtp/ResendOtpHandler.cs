using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;
using UserService.Application.Services;

namespace UserService.Application.Features.Users.Commands.ResendOtp;


internal sealed class ResendOtpHandler(
    IUserRepository _userRepository,
    IOtpService _otpService,
    IPublishEndpoint _publishEndpoint,
    IUnitOfWork _unitOfWork) 
    : ICommandHandler<ResendOtpCommand, ResendOtpResult>
{
    public async Task<ResendOtpResult> Handle(ResendOtpCommand command, CancellationToken cancellationToken)
    {
        var user = await _userRepository.FirstOrDefaultAsync(user => user.Email == command.Email);

        if (user == null)
        {
            throw new BadRequestException($"User with email \"{command.Email}\" not existed.");
        }

        var otp = await _otpService.GenerateOtpAsync(user.Id);

        var message = new SendEmailIntegrationEvent
        {
            To = user.Email,
            Subject = "Verify your account",
            PlainTextContent = $"Your OTP is {otp.Code}",
            HtmlContent = $@"
                <html>
                    <body>
                        <h1>Verify your account</h1>
                        <p>Your OTP is <strong>{otp.Code}</strong></p>
                    </body>
                </html>",
        };


        await Task.WhenAll(
            _publishEndpoint.Publish(message, cancellationToken),
            _unitOfWork.SaveChangesAsync(cancellationToken)
        );

        return new ResendOtpResult();
    }
}
