﻿using BuildingBlocks.Auth.Enums;
using BuildingBlocks.Auth.Services;

namespace UserService.Application.Features.Users.Commands.SignUp;

internal sealed class SignUpHandler(
    IPasswordService _passwordService,
    IUserRepository _userRepository,
    IUnitOfWork _unitOfWork)
    : ICommandHandler<SignUpCommand, SignUpResult>
{
    public async Task<SignUpResult> Handle(SignUpCommand command, CancellationToken cancellationToken)
    {
        var existedUser = await _userRepository.FirstOrDefaultAsync(user => user.PhoneNumber == command.PhoneNumber);

        if (existedUser != null)
        {
            throw new BadRequestException($"User with phone number \"{command.PhoneNumber}\" already existed.");
        }

        var user = new User
        { 
            Id = Guid.NewGuid(),
            PhoneNumber = command.PhoneNumber,
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
        user = await _userRepository.AddAsync(user);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new SignUpResult(user.Id);
    }
}
