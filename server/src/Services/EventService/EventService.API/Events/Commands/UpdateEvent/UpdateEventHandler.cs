using BuildingBlocks.Messaging.IntegrationEvents;
using BuildingBlocks.Shared.Constants;
using MassTransit;

namespace EventService.API.Events.Commands.UpdateEvent;

public record UpdateEventCommand(
    Guid EventId,
    string Name,
    string Description,
    Guid ImageId,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    List<VoucherTypeDto> VoucherTypes,
    List<EventGameDto> Games,
    ItemDto? Item) : ICommand<UpdateEventResult>;
public record UpdateEventResult();


public class UpdateEventCommandValidator : AbstractValidator<UpdateEventCommand>
{
    public UpdateEventCommandValidator()
    {
        RuleFor(e => e.Name)
            .NotEmpty().WithMessage("Event name is required");

        RuleFor(e => e.Description)
            .NotEmpty().WithMessage("Event description is required");

        RuleFor(e => e.ImageId)
            .NotEmpty().WithMessage("Event imageId is required");

        RuleFor(e => e.StartTime)
            .NotEmpty().WithMessage("Event start time is required")
            .GreaterThan(DateTimeOffset.UtcNow).WithMessage("Start time must be greater than now");

        RuleFor(e => e.EndTime)
            .NotEmpty().WithMessage("Event end time is required")
            .GreaterThan(e => e.StartTime).WithMessage("End time must be greater than start time");

        RuleFor(e => e.VoucherTypes)
            .NotEmpty().WithMessage("Event must have at least one voucher");

        RuleFor(e => e.VoucherTypes)
            .Must(types => types.Select(t => t.Discount).Distinct().Count() == types.Count)
            .WithMessage("Voucher types must have unique discount");

        RuleForEach(e => e.VoucherTypes).ChildRules(voucher =>
        {
            voucher.RuleFor(v => v.Discount)
                .GreaterThan(0).WithMessage("Voucher discount must be greater than 0")
                .LessThan(100).WithMessage("Voucher discount must be less than 100");

            voucher.RuleFor(v => v.Total)
                .GreaterThan(0).WithMessage("Voucher total codes must be greater than 0");
        });

        RuleFor(e => e.Games)
            .NotEmpty().WithMessage("Event must have at least one game");

        RuleFor(e => e.Games)
            .Must(games => games.Select(g => g.GameId).Distinct().Count() == games.Count)
            .WithMessage("Event games must have unique Game Ids");

        RuleForEach(e => e.Games)
            .ChildRules(g =>
            {
                g.RuleFor(g => g.GameId)
                    .NotEmpty().WithMessage("Game Id is required");

                g.When(g => g.GameId == GameIdentifiers.QuizGameId, () =>
                {
                    g.RuleFor(g => g.StartTime)
                        .NotEmpty().WithMessage("Start time is required for quiz-game");

                    g.RuleFor(g => g.QuizzCollectionId)
                        .NotEmpty().WithMessage("Quiz collection id is required for quiz-game");
                });
            });

        When(x => x.Games.Any(g => g.PopUpItemsEnabled), () =>
        {
            RuleFor(x => x.Item)
                .NotNull().WithMessage("Item is required when pop up items are enabled")
                .DependentRules(() =>
                {
                    RuleFor(x => x.Item!.ImageId)
                        .NotEmpty().WithMessage("Item imageId is required");
                    RuleFor(x => x.Item!.NumberPieces)
                        .GreaterThan(0).WithMessage("Item number of pieces must be greater than 0");
                });
        });
    }
}


public class UpdateEventHandler(
    IDocumentSession session,
    IClaimService claimService,
    IPublishEndpoint publishEndpoint) : ICommandHandler<UpdateEventCommand, UpdateEventResult>
{
    public async Task<UpdateEventResult> Handle(UpdateEventCommand command, CancellationToken cancellationToken)
    {
        var popUpItemsEnabled = command.Games.Any(g => g.PopUpItemsEnabled);

        if (popUpItemsEnabled && command.Item == null)
            throw new BadRequestException("There is pop up items game, but no item specified");

        var existingEvent = await session.LoadAsync<Entities.Event>(command.EventId);

        if (existingEvent == null)
            throw new NotFoundException("Event not found");

        var brandId = Guid.Parse(claimService.GetUserId());

        if (brandId != existingEvent.BrandId) throw new ForbiddenException();

        if (existingEvent.Status == EventStatus.Pending || 
            existingEvent.Status == EventStatus.Happening ||
            existingEvent.Status == EventStatus.Ended)
            throw new BadRequestException("Can't update approved event");

        var tasks = Task.CompletedTask;

        if (existingEvent.ImageId != command.ImageId)
        {
            var removeEventImageMessage = new RemoveMediaIntegrationEvent { MediaId = existingEvent.ImageId };
            var undraftEventImageMessage = new UndraftMediaIntegrationEvent { MediaId = command.ImageId };

            tasks = Task.WhenAll(
                publishEndpoint.Publish(undraftEventImageMessage, cancellationToken),
                publishEndpoint.Publish(removeEventImageMessage, cancellationToken));
        }

        if (existingEvent.Item == null)
        {
            if (command.Item != null)
            {
                var undraftItemImageMessage = new UndraftMediaIntegrationEvent { MediaId = command.Item.ImageId };
                tasks = Task.WhenAll(
                    tasks,
                    publishEndpoint.Publish(undraftItemImageMessage, cancellationToken));
            }
        }
        else if (command.Item != null)
        {
            if (existingEvent.Item.ImageId != command.Item.ImageId)
            {
                var removeItemImageMessage = new RemoveMediaIntegrationEvent { MediaId = existingEvent.Item.ImageId };
                var undraftItemImageMessage = new UndraftMediaIntegrationEvent { MediaId = command.Item.ImageId };
                tasks = Task.WhenAll(
                    tasks,
                    publishEndpoint.Publish(undraftItemImageMessage, cancellationToken),
                    publishEndpoint.Publish(removeItemImageMessage, cancellationToken));
            }
        }
        else
        {
            var removeItemImageMessage = new RemoveMediaIntegrationEvent { MediaId = existingEvent.Item.ImageId };
            tasks = Task.WhenAll(
                tasks,
                publishEndpoint.Publish(removeItemImageMessage, cancellationToken));
        }

        if (existingEvent.Status == EventStatus.Rejected)
            existingEvent.Status = EventStatus.Created;
        existingEvent.Name = command.Name;
        existingEvent.Description = command.Description;
        existingEvent.ImageId = command.ImageId;
        existingEvent.StartTime = command.StartTime;
        existingEvent.EndTime = command.EndTime;
        existingEvent.Games = command.Games.Select(g => new EventGame
        {
            GameId = g.GameId,
            PopUpItemsEnabled = g.PopUpItemsEnabled,
            QuizzCollectionId = g.QuizzCollectionId,
        }).ToList();

        existingEvent.VoucherTypes = command.VoucherTypes.Select(vt => new VoucherType
        {
            Id = Guid.NewGuid(),
            Discount = vt.Discount,
            Total = vt.Total,
            Remaining = vt.Total
        }).ToList();

        existingEvent.Item = command.Item == null ?
                null : new Item { ImageId = command.Item.ImageId, NumberPieces = command.Item.NumberPieces };

        session.Update(existingEvent);

        await Task.WhenAll(
            tasks,
            session.SaveChangesAsync(cancellationToken));

        return new UpdateEventResult();
    }
}