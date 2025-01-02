namespace EventService.API.Events.Queries.CheckEventExists;

public record CheckEventExistsQuery(Guid EventId) : IQuery<bool>;

public class CheckEventExistsHandler(IDocumentSession session) : IQueryHandler<CheckEventExistsQuery, bool>
{
    public async Task<bool> Handle(CheckEventExistsQuery query, CancellationToken cancellationToken)
    {
        var isExisted = await session.Query<Event>().AnyAsync(e => e.Id == query.EventId);

        return isExisted;
    }
}