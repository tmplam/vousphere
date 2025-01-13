namespace UserService.Application.Features.Users.Commands.GiftPlayrounds;

public record GiftPlayroundsCommand(Guid RecipientId, int NumberOfRounds) : ICommand<GiftPlayroundsResult>;
public record GiftPlayroundsResult();

