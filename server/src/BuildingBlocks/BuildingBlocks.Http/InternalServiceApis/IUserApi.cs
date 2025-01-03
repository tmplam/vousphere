using BuildingBlocks.Http.Dtos.Users;
using Refit;

namespace BuildingBlocks.Http.InternalServiceApis;

public interface IUserApi
{
    [Post("/api/users/brands-info")]
    Task<Dictionary<Guid, BrandDto>> GetBrandsInfoAsync(params IEnumerable<Guid> brandIds);

    [Get("/api/users/{brandId}/brand-info")]
    Task<BrandDto> GetBrandInfoAsync(Guid brandId);
}
