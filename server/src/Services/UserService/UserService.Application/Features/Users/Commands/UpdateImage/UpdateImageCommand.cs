namespace UserService.Application.Features.Users.Commands.UpdateImage;

public record UpdateImageCommand(Guid ImageId) : ICommand<UpdateImageResult>;
public record UpdateImageResult();
