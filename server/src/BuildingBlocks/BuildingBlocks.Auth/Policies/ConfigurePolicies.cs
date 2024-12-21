using BuildingBlocks.Auth.Constants;
using BuildingBlocks.Auth.Enums;
using Microsoft.AspNetCore.Authorization;

namespace BuildingBlocks.Auth.Policies;

public static class ConfigurePolicies
{
    public static void AddAllPolicies(AuthorizationOptions options)
    {
        options.AddPolicy(AuthPolicy.Admin, policy =>
        {
            policy.RequireRole(UserRole.Admin.ToString());
        });

        options.AddPolicy(AuthPolicy.BrandOrAdmin, policy =>
        {
            policy.RequireRole(UserRole.Brand.ToString(), UserRole.Admin.ToString());
        });   
    }
}
