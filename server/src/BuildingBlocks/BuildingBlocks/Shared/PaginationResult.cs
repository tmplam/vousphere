namespace BuildingBlocks.Shared;

public record PaginationResult<TEntity>(long Page, long PerPage, long Total, long TotalPage, IEnumerable<TEntity> Data) where TEntity : class;