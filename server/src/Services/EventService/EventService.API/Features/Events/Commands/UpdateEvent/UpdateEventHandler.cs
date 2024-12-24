namespace EventService.API.Features.Events.Commands.UpdateEvent;

public record UpdateEventCommand(
    Guid EventId,
    string Name,
    string Description,
    string Image,
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

        RuleFor(e => e.Image)
            .NotEmpty().WithMessage("Event image is required");

        RuleFor(e => e.StartTime)
            .NotEmpty().WithMessage("Event start time is required")
            .GreaterThan(DateTimeOffset.UtcNow).WithMessage("Start time must be greater than now");

        RuleFor(e => e.EndTime)
            .NotEmpty().WithMessage("Event end time is required")
            .GreaterThan(e => e.StartTime).WithMessage("End time must be greater than start time");

        RuleFor(e => e.VoucherTypes)
            .NotEmpty().WithMessage("Event must have at least one voucher");

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

        RuleForEach(e => e.Games).ChildRules(game =>
        {
            game.RuleFor(g => g.GameId)
                .NotEmpty().WithMessage("Game Id is required");
        });

        When(x => x.Item is not null, () =>
        {
            RuleFor(x => x.Item!.Image)
                .NotEmpty().WithMessage("Item image is required");

            RuleFor(x => x.Item!.NumberPieces)
                .GreaterThan(0).WithMessage("Item number of pieces must be greater than 0");
        });
    }
}


public class UpdateEventHandler(
    IDocumentSession session,
    IClaimService claimService) : ICommandHandler<UpdateEventCommand, UpdateEventResult>
{
    public async Task<UpdateEventResult> Handle(UpdateEventCommand command, CancellationToken cancellationToken)
    {
        var popUpItemsEnabled = command.Games.Any(g => g.PopUpItemsEnabled);

        if (popUpItemsEnabled && command.Item == null)
            throw new BadRequestException("There is pop up items game, but no item specified");

        var existingEvent = await session.LoadAsync<Event>(command.EventId);

        if (existingEvent == null)
            throw new NotFoundException("Event not found");

        var brandId = Guid.Parse(claimService.GetUserId());

        if (brandId != existingEvent.BrandId) throw new ForbiddenException();

        if (existingEvent.Status == EventStatus.Approved && DateTimeOffset.UtcNow >= existingEvent.StartTime)
            throw new BadRequestException("Can't update started event");

        existingEvent.Name = command.Name;
        existingEvent.Description = command.Description;
        existingEvent.Image = command.Image;
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
                null : new Item { Image = command.Item.Image, NumberPieces = command.Item.NumberPieces };

        session.Update(existingEvent);
        await session.SaveChangesAsync();

        return new UpdateEventResult();
    }
}
