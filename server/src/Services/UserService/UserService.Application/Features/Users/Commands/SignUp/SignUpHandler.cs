using BuildingBlocks.Auth.Enums;
using BuildingBlocks.Auth.Services;
using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;
using UserService.Application.Services;
using UserService.Domain.Enums;

namespace UserService.Application.Features.Users.Commands.SignUp;

internal sealed class SignUpHandler(
    IPasswordService _passwordService,
    IUserRepository _userRepository,
    IOtpService _otpService,
    IPublishEndpoint _publishEndpoint,
    IUnitOfWork _unitOfWork)
    : ICommandHandler<SignUpCommand, SignUpResult>
{
    public async Task<SignUpResult> Handle(SignUpCommand command, CancellationToken cancellationToken)
    {
        var existedUser = await _userRepository.FirstOrDefaultAsync(user => user.Email == command.Email);

        if (existedUser != null && existedUser.Status != UserStatus.Created)
            throw new BadRequestException($"User with email \"{command.Email}\" already existed.");

        var user = existedUser ?? new User
        { 
            Id = Guid.NewGuid(),
            Name = command.Name,
            Email = command.Email,
        };

        user.Password = _passwordService.HashPassword(user, command.Password);
        if (command.IsBrand)
        {
            user.Role = UserRole.Brand;
            user.Brand = new Brand
            {
                UserId = user.Id,
            };
        }
        else
        {
            user.Role = UserRole.Player;
            user.Player = new Player
            {
                UserId = user.Id,
            };
        }

        if (existedUser == null)
        {
            user = await _userRepository.AddAsync(user);
        }

        var otp = await _otpService.GenerateOtpAsync(user.Id);

        var message = new SendEmailIntegrationEvent
        {
            To = user.Email,
            Subject = "Verify your email",
            PlainTextContent = $"Your OTP is {otp.Code}",
            HtmlContent = $@"
                <html>
                    <body>
                        <h1>Verify your email</h1>
                        <p>Your OTP is <strong>{otp.Code}</strong></p>
                    </body>
                </html>",
        };


        await Task.WhenAll(
            _publishEndpoint.Publish(message, cancellationToken),
            _unitOfWork.SaveChangesAsync(cancellationToken)
        );

        return new SignUpResult(user.Id);
    }
}
