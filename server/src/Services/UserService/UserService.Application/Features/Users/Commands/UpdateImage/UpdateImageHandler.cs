using BuildingBlocks.Auth.Services;
using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;

namespace UserService.Application.Features.Users.Commands.UpdateImage;

internal sealed class UpdateImageHandler(
    IUserRepository _userRepository,
    IClaimService _claimService,
    IPublishEndpoint _publishEndpoint,
    IUnitOfWork _unitOfWork)
    : ICommandHandler<UpdateImageCommand, UpdateImageResult>
{
    public async Task<UpdateImageResult> Handle(UpdateImageCommand command, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_claimService.GetUserId());
        var user = await _userRepository.FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
            throw new NotFoundException(nameof(User), userId);

        if (user.ImageId == command.ImageId)
            return new UpdateImageResult();

        var tasks = Task.CompletedTask;

        if (user.ImageId != null)
        {
            var removeImageEvent = new RemoveMediaIntegrationEvent
            {
                MediaId = user.ImageId.Value
            };
            tasks = _publishEndpoint.Publish(removeImageEvent);
        }

        var addImageEvent = new UndraftMediaIntegrationEvent
        {
            MediaId = command.ImageId
        };

        tasks = Task.WhenAll(tasks, _publishEndpoint.Publish(addImageEvent));


        user.ImageId = command.ImageId;

        await Task.WhenAll(tasks, _unitOfWork.SaveChangesAsync());

        return new UpdateImageResult();
    }
}
