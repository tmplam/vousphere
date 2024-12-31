namespace BuildingBlocks.Http.Options;

public class InternalServiceOptions
{
    public string EventBaseUrl { get; init; } = string.Empty;
    public string VoucherBaseUrl { get; init; } = string.Empty;
    public string MediaBaseUrl { get; init; } = string.Empty;
    public string PaymentBaseUrl { get; init; } = string.Empty;
    public string GameBaseUrl { get; init; } = string.Empty;
    public string NotificationBaseUrl { get; init; } = string.Empty;
    public string UserBaseUrl { get; init; } = string.Empty;
}
