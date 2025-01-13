using BuildingBlocks.Messaging.IntegrationEvents;
using BuildingBlocks.Shared.Constants;
using MassTransit;
using System.Security.Claims;

namespace EventService.API.Events.Commands.CreateEvent;

public record CreateEventCommand(
    string Name,
    string Description,
    Guid ImageId,
    DateTimeOffset StartTime,
    DateTimeOffset EndTime,
    List<VoucherTypeDto> VoucherTypes,
    List<EventGameDto> Games,
    ItemDto? Item) : ICommand<CreateEventResult>;
public record CreateEventResult(Guid EventId);


public class CreateEventCommandValidator : AbstractValidator<CreateEventCommand>
{
    public CreateEventCommandValidator()
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


public class CreateEventHandler(
    IDocumentSession _session,
    IClaimService _claimService,
    IPublishEndpoint _publishEndpoint)
    : ICommandHandler<CreateEventCommand, CreateEventResult>
{
    public async Task<CreateEventResult> Handle(CreateEventCommand command, CancellationToken cancellationToken)
    {
        var brandId = Guid.Parse(_claimService.GetUserId());
        var brandName = _claimService.GetClaim(ClaimTypes.Name);

        var popUpItemsEnabled = command.Games.Any(g => g.PopUpItemsEnabled);

        if (popUpItemsEnabled && command.Item == null)
            throw new BadRequestException("There is pop up items game, but no item specified");

        var newEvent = new Entities.Event
        {
            Name = command.Name,
            Description = command.Description,
            ImageId = command.ImageId,
            CreatedAt = DateTimeOffset.UtcNow,
            StartTime = command.StartTime,
            EndTime = command.EndTime,
            BrandId = brandId,
            VoucherTypes = command.VoucherTypes.Select(vt => new VoucherType
            {
                Id = Guid.NewGuid(),
                Discount = vt.Discount,
                Total = vt.Total,
                Remaining = vt.Total
            }).ToList(),
            Games = command.Games.Select(g => new EventGame
            {
                GameId = g.GameId,
                PopUpItemsEnabled = g.PopUpItemsEnabled,
                StartTime = g.StartTime,
                QuizzCollectionId = g.QuizzCollectionId,
            }).ToList(),
            Item = command.Item == null ?
                null : new Item { ImageId = command.Item.ImageId, NumberPieces = command.Item.NumberPieces },
        };

        _session.Store(newEvent);

        var undraftEventImageMessage = new UndraftMediaIntegrationEvent { MediaId = newEvent.ImageId };
        var eventCreatedMessage = new EventCreatedIntegrationEvent 
        { 
            EventId = newEvent.Id,
            BrandId = newEvent.BrandId,
            EventName = newEvent.Name,
            BrandName = brandName ?? string.Empty,
        };

        var tasks = Task.WhenAll(
            _session.SaveChangesAsync(cancellationToken),
            _publishEndpoint.Publish(undraftEventImageMessage, cancellationToken),
            _publishEndpoint.Publish(eventCreatedMessage, cancellationToken));

        if (command.Item != null)
        {
            var undraftItemImageMessage = new UndraftMediaIntegrationEvent { MediaId = command.Item.ImageId };
            tasks = Task.WhenAll(tasks, _publishEndpoint.Publish(undraftItemImageMessage, cancellationToken));
        }

        await tasks;

        return new CreateEventResult(newEvent.Id);
    }
}