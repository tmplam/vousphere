using BuildingBlocks.Auth.Abstractions;
using BuildingBlocks.Auth.Abstractions.Services;
using BuildingBlocks.Auth.OptionsSetup;
using BuildingBlocks.Auth.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using UserService.Application.Repositories;
using UserService.Infrastructure.Persistence;
using UserService.Infrastructure.Persistence.Repositories;

namespace UserService.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Database");

        services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
        {
            options.UseSqlServer(connectionString);
        });

        services.ConfigureOptions<JwtOptionsSetup>();

        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Services
        services.AddScoped<IPasswordHasher<AuthUser>, PasswordHasher<AuthUser>>();
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<IJwtProvider, JwtProvider>();
        services.AddScoped<IClaimService, ClaimService>();

        return services;
    }
}
