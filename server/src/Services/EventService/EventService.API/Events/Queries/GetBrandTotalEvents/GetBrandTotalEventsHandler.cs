namespace EventService.API.Events.Queries.GetBrandTotalEvents;

public record GetBrandTotalEventsQuery() : IQuery<GetBrandTotalEventsResult>;
public record GetBrandTotalEventsResult(long TotalEvents, long TotalReleasedVouchers);


public class GetBrandTotalEventsHandler(
    IDocumentSession _session,
    IClaimService _claimService)
    : IQueryHandler<GetBrandTotalEventsQuery, GetBrandTotalEventsResult>
{
    public async Task<GetBrandTotalEventsResult> Handle(GetBrandTotalEventsQuery query, CancellationToken cancellationToken)
    {
        var brandId = Guid.Parse(_claimService.GetUserId());

        var totalEvents = await _session.Query<Event>()
            .Where(x => x.BrandId == brandId)
            .CountAsync();

        var totalVouchers = await _session.Query<Event>()
            .Where(x => x.BrandId == brandId)
            .SumAsync(x => x.TotalPublishedVouchers);

        return new GetBrandTotalEventsResult(totalEvents, totalVouchers);
    }
}
