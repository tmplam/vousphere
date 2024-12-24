namespace BuildingBlocks.Shared;

public record PaginationResult<TEntity>(long Page, long PerPage, long Total, long TotalPage, IEnumerable<TEntity> Data) where TEntity : class
{
    public static PaginationResult<TEntity> Create(long Page, long PerPage, long Total, long TotalPage, IEnumerable<TEntity> Data)
    {
        return new PaginationResult<TEntity>(Page, PerPage, Total, TotalPage, Data);
    }
}