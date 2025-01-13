namespace UserService.Application.Features.Users.Queries.GetTotalBrands;

internal sealed class GetTotalBrandsHandler : IQueryHandler<GetTotalBrandsQuery, GetTotalBrandsResult>
{
    public Task<GetTotalBrandsResult> Handle(GetTotalBrandsQuery query, CancellationToken cancellationToken)
    {
        return Task.FromResult(new GetTotalBrandsResult(0));
    }
}
