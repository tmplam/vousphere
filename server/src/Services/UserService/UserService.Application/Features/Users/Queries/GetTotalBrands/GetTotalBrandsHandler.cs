using BuildingBlocks.Auth.Enums;

namespace UserService.Application.Features.Users.Queries.GetTotalBrands;

internal sealed class GetTotalBrandsHandler(
    IUserRepository _userRepository) : IQueryHandler<GetTotalBrandsQuery, GetTotalBrandsResult>
{
    public async Task<GetTotalBrandsResult> Handle(GetTotalBrandsQuery query, CancellationToken cancellationToken)
    {
        var totalBrands = await _userRepository.CountAsync(x => x.Role == UserRole.Brand);
        return new GetTotalBrandsResult(totalBrands);
    }
}
