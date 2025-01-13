namespace UserService.Application.Features.Users.Queries.GetTotalBrands;

public record GetTotalBrandsQuery() : IQuery<GetTotalBrandsResult>;
public record GetTotalBrandsResult(int TotalBrands);
