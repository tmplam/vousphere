using BuildingBlocks.Messaging.IntegrationEvents;
using MassTransit;

namespace GameService.API.Features.Games.Commands.UpdateGame;

public record UpdateGameCommand(
    Guid GameId,
    string Name,
    string Description,
    Guid ImageId) : ICommand<UpdateGameResult>;
public record UpdateGameResult();

public class UpdateGameCommandValidator : AbstractValidator<UpdateGameCommand>
{
    public UpdateGameCommandValidator()
    {
        RuleFor(q => q.Name)
            .NotEmpty().WithMessage("Game name is requied");

        RuleFor(q => q.Description)
            .NotEmpty().WithMessage("Game description is requied");

        RuleFor(q => q.ImageId)
            .NotEmpty().WithMessage("Game image id is requied");
    }
}



internal sealed class UpdateGameHandler(
    IDocumentSession _session,
    IPublishEndpoint _publishEndpoint) : ICommandHandler<UpdateGameCommand, UpdateGameResult>
{
    public async Task<UpdateGameResult> Handle(UpdateGameCommand command, CancellationToken cancellationToken)
    {
        var game = await _session.LoadAsync<Game>(command.GameId);

        if (game == null)
            throw new NotFoundException("Game not found");

        game.Name = command.Name;
        game.Description = command.Description;

        var tasks = Task.CompletedTask;
        if (game.ImageId != command.ImageId)
        {
            var undraftImageMessage = new UndraftMediaIntegrationEvent
            {
                MediaId = command.ImageId
            };

            var removeDraftImageMessage = new RemoveMediaIntegrationEvent
            {
                MediaId = game.ImageId
            };

            tasks = Task.WhenAll(
                _publishEndpoint.Publish(undraftImageMessage),
                _publishEndpoint.Publish(removeDraftImageMessage)
            );
        }

        game.ImageId = command.ImageId;

        await Task.WhenAll(
            _session.SaveChangesAsync(),
            tasks
        );

        return new UpdateGameResult();
    }
}
