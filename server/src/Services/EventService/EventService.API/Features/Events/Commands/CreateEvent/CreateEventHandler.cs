using EventService.API.Dtos;

namespace EventService.API.Features.Events.Commands.CreateEvent;

public record CreateEventCommand(
    string Name,
    string Image,
    string Description,
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

        RuleFor(e => e.Image)
            .NotEmpty().WithMessage("Event image is required");

        RuleFor(e => e.Description)
            .NotEmpty().WithMessage("Event description is required");

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


public class CreateEventHandler(IDocumentSession session) : ICommandHandler<CreateEventCommand, CreateEventResult>
{
    public async Task<CreateEventResult> Handle(CreateEventCommand command, CancellationToken cancellationToken)
    {
        
    }
}
